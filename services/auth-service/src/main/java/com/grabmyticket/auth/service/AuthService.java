package com.grabmyticket.auth.service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.grabmyticket.auth.dto.AuthResponse;
import com.grabmyticket.auth.dto.LoginRequest;
import com.grabmyticket.auth.dto.SignupRequest;
import com.grabmyticket.auth.dto.SignupResponse;
import com.grabmyticket.auth.dto.UserProfileResponse;
import com.grabmyticket.auth.entity.AuthProvider;
import com.grabmyticket.auth.entity.Role;
import com.grabmyticket.auth.entity.RoleName;
import com.grabmyticket.auth.entity.TokenPurpose;
import com.grabmyticket.auth.entity.User;
import com.grabmyticket.auth.entity.VerificationToken;
import com.grabmyticket.auth.exception.EmailAlreadyExistsException;
import com.grabmyticket.auth.exception.EmailNotVerifiedException;
import com.grabmyticket.auth.exception.InvalidCredentialsException;
import com.grabmyticket.auth.exception.InvalidRoleOperationException;
import com.grabmyticket.auth.exception.SuspendedAccountException;
import com.grabmyticket.auth.exception.UserNotFoundException;
import com.grabmyticket.auth.repository.RoleRepository;
import com.grabmyticket.auth.repository.UserRepository;
import com.grabmyticket.auth.security.GoogleIdTokenVerifier;
import com.grabmyticket.auth.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final VerificationTokenService verificationTokenService;
    private final GoogleAuthService googleAuthService;
    private final GoogleIdTokenVerifier googleIdTokenVerifier;
    private final RefreshTokenService refreshTokenService;

    public AuthService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            VerificationTokenService verificationTokenService,
            GoogleAuthService googleAuthService,
            GoogleIdTokenVerifier googleIdTokenVerifier,
            RefreshTokenService refreshTokenService
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.verificationTokenService = verificationTokenService;
        this.googleAuthService = googleAuthService;
        this.googleIdTokenVerifier = googleIdTokenVerifier;
        this.refreshTokenService = refreshTokenService;
    }

    @Transactional
    public SignupResponse signup(SignupRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();

        Optional<User> existing = userRepository.findByEmail(normalizedEmail);
        if (existing.isPresent()) {
            User existingUser = existing.get();

            if (existingUser.getPasswordHash() != null) {
                // Real collision - a LOCAL (or already-linked) account is already there.
                throw new EmailAlreadyExistsException();
            }

            // Google-only account, no password yet: don't block and don't create a
            // duplicate - offer to link password login onto the existing account,
            // gated on clicking the emailed link (proves whoever's filling this form
            // actually owns the inbox, since a Google login alone doesn't establish that
            // for THIS request).
            verificationTokenService.issueAndSendLinkPassword(existingUser);
            return SignupResponse.linkPending(
                    "An account with this email already exists via Google sign-in. "
                            + "We've sent a link to " + existingUser.getEmail()
                            + " to enable password login for it too.");
        }

        Set<Role> roles = new HashSet<>();
        boolean wantsToOrganize = Boolean.TRUE.equals(request.wantsToOrganize());
        // Exclusive at signup, not additive - an organizer signup does NOT also get
        // ROLE_USER for free. Every account starts with exactly one role; the other
        // is only ever added later, deliberately, via the self-service becomeOrganizer
        // / becomeCustomer confirm-modal flow (see AuthController /auth/roles/*).
        roles.add(requireRole(wantsToOrganize ? RoleName.ROLE_ORGANIZER : RoleName.ROLE_USER));

        User user = User.builder()
                .email(normalizedEmail)
                .passwordHash(passwordEncoder.encode(request.password()))
                .fullName(request.fullName().trim())
                .provider(AuthProvider.LOCAL)
                .emailVerified(false)
                // wantsToOrganize already captured the "host events?" choice - never
                // show the post-Google-login prompt for this account.
                .rolePromptSeen(true)
                .roles(roles)
                .activePersona(wantsToOrganize ? "organizer" : "user")
                .build();

        user = userRepository.save(user);
        verificationTokenService.issueAndSendVerifyEmail(user);

        return SignupResponse.created(issueTokenPair(user));
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(InvalidCredentialsException::new);

        if (user.getPasswordHash() == null
                || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            // Same exception whether the email doesn't exist or the password is wrong -
            // never let the response reveal which one it was.
            throw new InvalidCredentialsException();
        }

        if (!user.isEmailVerified()) {
            // Don't auto-resend here - the frontend shows a dedicated "please verify
            // your account" screen with an explicit resend button instead. Firing an
            // email on every failed login attempt is a spam/rate-limit risk for
            // something the user didn't explicitly ask for.
            throw new EmailNotVerifiedException();
        }

        return issueTokenPair(user);
    }

    @Transactional
    public AuthResponse loginWithGoogle(String rawIdToken) {
        Jwt googleToken = googleIdTokenVerifier.verify(rawIdToken);

        String googleSub = googleToken.getSubject();
        String email = googleToken.getClaimAsString("email");
        String fullName = googleToken.getClaimAsString("name");

        User user = googleAuthService.findOrCreateUser(googleSub, email, fullName);

        return issueTokenPair(user);
    }

    @Transactional
    public AuthResponse refresh(String rawRefreshToken) {
        RefreshTokenService.RotationResult result = refreshTokenService.rotate(rawRefreshToken);
        String accessToken = jwtService.generateAccessToken(result.user());
        return AuthResponse.bearer(accessToken, result.rawRefreshToken(), jwtService.getAccessTokenTtlSeconds(), result.user());
    }

    @Transactional
    public void logout(String rawRefreshToken) {
        refreshTokenService.revoke(rawRefreshToken);
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUser(String currentUserId) {
        User user = userRepository.findById(UUID.fromString(currentUserId))
                .orElseThrow(UserNotFoundException::new);

        return UserProfileResponse.from(user);
    }

    /** Self-service USER -> USER+ORGANIZER upgrade, gated on email_verified (Option A from our RBAC plan). */
    @Transactional
    public AuthResponse becomeOrganizer(String currentUserId) {
        User user = requireUser(currentUserId);

        if (!user.isEmailVerified()) {
            throw new EmailNotVerifiedException("Please verify your email before becoming an organizer");
        }

        if (!user.hasRole(RoleName.ROLE_ORGANIZER)) {
            user.getRoles().add(requireRole(RoleName.ROLE_ORGANIZER));
        }
        // Opting in via this endpoint is itself an answer to the "host events?"
        // prompt - dismiss it either way so it never resurfaces.
        user.setRolePromptSeen(true);
        // Becoming an organizer is a strong signal they want to land there next time too.
        user.setActivePersona("organizer");
        user = userRepository.save(user);

        return issueTokenPair(user);
    }

    /**
     * Self-service ORGANIZER -> ORGANIZER+USER upgrade - symmetric to becomeOrganizer above.
     * No email-verified gate here: buying a ticket doesn't carry the same trust bar as
     * hosting events, and this is typically confirmed mid-checkout (see PersonaSwitchGate
     * on the client) where blocking on verification would just dead-end the purchase.
     */
    @Transactional
    public AuthResponse becomeCustomer(String currentUserId) {
        User user = requireUser(currentUserId);

        if (!user.hasRole(RoleName.ROLE_USER)) {
            user.getRoles().add(requireRole(RoleName.ROLE_USER));
        }
        // Confirming this modal is itself a strong signal they want to land as a
        // customer next time too - same convention as becomeOrganizer above.
        user.setActivePersona("user");
        user = userRepository.save(user);

        return issueTokenPair(user);
    }

    /** Called when the user declines the "also host events?" prompt after Google sign-in - never ask again. */
    @Transactional
    public void dismissRolePrompt(String currentUserId) {
        User user = requireUser(currentUserId);
        if (!user.isRolePromptSeen()) {
            user.setRolePromptSeen(true);
            userRepository.save(user);
        }
    }

    /** Confirms a link-password email token and attaches a password to a previously Google-only account. */
    @Transactional
    public AuthResponse confirmLinkPassword(String rawToken, String newPassword) {
        VerificationToken token = verificationTokenService.consume(rawToken, TokenPurpose.LINK_PASSWORD);
        User user = token.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user = userRepository.save(user);
        return issueTokenPair(user);
    }

    /**
     * Deliberately silent about whether the email exists, same pattern as
     * resend-verification - never reveals which emails are registered.
     */
    @Transactional
    public void forgotPassword(String email) {
        userRepository.findByEmail(email.trim().toLowerCase())
                .ifPresent(verificationTokenService::issueAndSendPasswordReset);
    }

    /**
     * Clicking the emailed link both verifies AND authenticates - no separate login
     * step afterwards, on whatever device the link was clicked from (see the
     * Google-OAuth parity discussion: an inbox click is an equally strong ownership
     * proof as Google's own verification).
     */
    @Transactional
    public AuthResponse verifyEmail(String rawToken) {
        User user = verificationTokenService.verifyEmail(rawToken);
        return issueTokenPair(user);
    }

    @Transactional
    public AuthResponse resetPassword(String rawToken, String newPassword) {
        VerificationToken token = verificationTokenService.consume(rawToken, TokenPurpose.RESET_PASSWORD);
        User user = token.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        // Deliberately does NOT touch emailVerified - resetting a password is a
        // separate proof from verifying an account, kept as two independent gates.
        // An unverified account that resets its password successfully still hits
        // the "please verify your account" screen on its next login.
        user = userRepository.save(user);
        return issueTokenPair(user);
    }

    /**
     * Settings-page password change. If the account has no password yet (Google-only,
     * setting one for the first time while already authenticated), currentPassword is
     * not required - the session itself is the proof of ownership. Otherwise it must
     * match before the change is allowed.
     */
    @Transactional
    public void changePassword(String currentUserId, String currentPassword, String newPassword) {
        User user = requireUser(currentUserId);

        if (user.getPasswordHash() != null) {
            if (currentPassword == null || currentPassword.isBlank()
                    || !passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
                throw new InvalidCredentialsException();
            }
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    /**
     * Explicit switch between Organizer and Customer view for a dual-role account -
     * server-side so it's the single source of truth across every device/tab/future
     * mobile app, not a browser-local preference. Both personas now require actually
     * holding the matching role - ROLE_USER is no longer guaranteed on every account
     * (see AuthService.signup), so "user" needs the same guard "organizer" already had.
     */
    @Transactional
    public UserProfileResponse updateActivePersona(String currentUserId, String persona) {
        if (!"organizer".equals(persona) && !"user".equals(persona)) {
            throw new InvalidRoleOperationException("persona must be 'organizer' or 'user'");
        }

        User user = requireUser(currentUserId);
        if ("organizer".equals(persona) && !user.hasRole(RoleName.ROLE_ORGANIZER)) {
            throw new InvalidRoleOperationException("This account is not an organizer");
        }
        if ("user".equals(persona) && !user.hasRole(RoleName.ROLE_USER)) {
            throw new InvalidRoleOperationException("This account is not a customer");
        }

        user.setActivePersona(persona);
        user = userRepository.save(user);
        return UserProfileResponse.from(user);
    }

    private User requireUser(String currentUserId) {
        return userRepository.findById(UUID.fromString(currentUserId))
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found - id: " + currentUserId));
    }

    private AuthResponse issueTokenPair(User user) {
        // Single choke point for every flow that ever mints a token (login,
        // google login, refresh, email verify, password reset, persona
        // switch) - a suspended account is blocked from all of them here
        // rather than needing the check repeated at each call site.
        if (!user.isEnabled()) {
            throw new SuspendedAccountException(
                    user.getSuspensionReason() != null
                            ? "Your account has been suspended: " + user.getSuspensionReason()
                            : "Your account has been suspended. Contact support for details.");
        }
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = refreshTokenService.issue(user);
        return AuthResponse.bearer(accessToken, refreshToken, jwtService.getAccessTokenTtlSeconds(), user);
    }

    private Role requireRole(RoleName roleName) {
        return roleRepository.findByName(roleName)
                .orElseThrow(() -> new IllegalStateException(
                        "Role " + roleName + " is missing from the database - check V1 migration ran"));
    }
}
