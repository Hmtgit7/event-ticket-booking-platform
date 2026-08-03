package com.grabmyticket.auth.service;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.grabmyticket.auth.dto.AuthResponse;
import com.grabmyticket.auth.dto.LoginRequest;
import com.grabmyticket.auth.dto.SignupRequest;
import com.grabmyticket.auth.dto.UserProfileResponse;
import com.grabmyticket.auth.entity.AuthProvider;
import com.grabmyticket.auth.entity.Role;
import com.grabmyticket.auth.entity.RoleName;
import com.grabmyticket.auth.entity.User;
import com.grabmyticket.auth.exception.EmailAlreadyExistsException;
import com.grabmyticket.auth.exception.EmailNotVerifiedException;
import com.grabmyticket.auth.exception.InvalidCredentialsException;
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
    public AuthResponse signup(SignupRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new EmailAlreadyExistsException();
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
                .roles(roles)
                .build();

        user = userRepository.save(user);
        verificationTokenService.issueAndSend(user);

        return issueTokenPair(user);
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
        User user = userRepository.findById(UUID.fromString(currentUserId))
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found - id: " + currentUserId));

        if (!user.isEmailVerified()) {
            throw new EmailNotVerifiedException();
        }

        if (!user.hasRole(RoleName.ROLE_ORGANIZER)) {
            user.getRoles().add(requireRole(RoleName.ROLE_ORGANIZER));
            user = userRepository.save(user);
        }

        return issueTokenPair(user);
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
