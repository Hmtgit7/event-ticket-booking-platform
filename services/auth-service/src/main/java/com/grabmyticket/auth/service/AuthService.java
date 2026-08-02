package com.grabmyticket.auth.service;

import java.util.HashSet;
import java.util.Set;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.grabmyticket.auth.dto.AuthResponse;
import com.grabmyticket.auth.dto.LoginRequest;
import com.grabmyticket.auth.dto.SignupRequest;
import com.grabmyticket.auth.entity.AuthProvider;
import com.grabmyticket.auth.entity.Role;
import com.grabmyticket.auth.entity.RoleName;
import com.grabmyticket.auth.entity.User;
import com.grabmyticket.auth.exception.EmailAlreadyExistsException;
import com.grabmyticket.auth.exception.InvalidCredentialsException;
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

    public AuthService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            VerificationTokenService verificationTokenService,
            GoogleAuthService googleAuthService,
            GoogleIdTokenVerifier googleIdTokenVerifier
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.verificationTokenService = verificationTokenService;
        this.googleAuthService = googleAuthService;
        this.googleIdTokenVerifier = googleIdTokenVerifier;
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

        String accessToken = jwtService.generateAccessToken(user);
        return AuthResponse.bearer(accessToken, jwtService.getAccessTokenTtlSeconds(), user);
    }

    @Transactional(readOnly = true)
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

        String accessToken = jwtService.generateAccessToken(user);
        return AuthResponse.bearer(accessToken, jwtService.getAccessTokenTtlSeconds(), user);
    }

    @Transactional
    public AuthResponse loginWithGoogle(String rawIdToken) {
        Jwt googleToken = googleIdTokenVerifier.verify(rawIdToken);

        String googleSub = googleToken.getSubject();
        String email = googleToken.getClaimAsString("email");
        String fullName = googleToken.getClaimAsString("name");

        User user = googleAuthService.findOrCreateUser(googleSub, email, fullName);

        String accessToken = jwtService.generateAccessToken(user);
        return AuthResponse.bearer(accessToken, jwtService.getAccessTokenTtlSeconds(), user);
    }

    private Role requireRole(RoleName roleName) {
        return roleRepository.findByName(roleName)
                .orElseThrow(() -> new IllegalStateException(
                        "Role " + roleName + " is missing from the database - check V1 migration ran"));
    }
}
