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
import com.grabmyticket.auth.exception.TooManyRequestsException;
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
        roles.add(requireRole(RoleName.ROLE_USER));
        if (Boolean.TRUE.equals(request.wantsToOrganize())) {
            // Granted now per our "instant approve" decision, but functionally inert
            // until email_verified = true - enforced in Phase 3/6, not here.
            roles.add(requireRole(RoleName.ROLE_ORGANIZER));
        }

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
            // Don't let them in, but don't leave them stuck either - re-send a fresh
            // link on every attempt. If they're inside the resend cooldown window we
            // just swallow that - the earlier email is still valid, and the person
            // logging in should only ever see "please verify your email", never a
            // rate-limit error for something they didn't explicitly request.
            try {
                verificationTokenService.issueAndSendVerifyEmail(user);
            } catch (TooManyRequestsException ignored) {
                // A link was already sent very recently - nothing more to do here.
            }
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

    @Transactional
    public AuthResponse resetPassword(String rawToken, String newPassword) {
        VerificationToken token = verificationTokenService.consume(rawToken, TokenPurpose.RESET_PASSWORD);
        User user = token.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        if (!user.isEmailVerified()) {
            // Clicking an emailed link proves ownership just as well as the
            // normal verify-email flow does.
            user.setEmailVerified(true);
        }
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

    private User requireUser(String currentUserId) {
        return userRepository.findById(UUID.fromString(currentUserId))
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found - id: " + currentUserId));
    }

    private AuthResponse issueTokenPair(User user) {
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
