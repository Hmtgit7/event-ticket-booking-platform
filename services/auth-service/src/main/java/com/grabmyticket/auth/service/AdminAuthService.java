package com.grabmyticket.auth.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.grabmyticket.auth.dto.AuthResponse;
import com.grabmyticket.auth.dto.LoginRequest;
import com.grabmyticket.auth.entity.Role;
import com.grabmyticket.auth.entity.RoleName;
import com.grabmyticket.auth.entity.User;
import com.grabmyticket.auth.exception.AdminBootstrapException;
import com.grabmyticket.auth.exception.InvalidCredentialsException;
import com.grabmyticket.auth.repository.RoleRepository;
import com.grabmyticket.auth.repository.UserRepository;
import com.grabmyticket.auth.security.JwtService;

/**
 * Admin-specific auth: login is the same credential check as a normal login,
 * PLUS the account must actually hold ROLE_ADMIN. bootstrap() exists only to
 * create the FIRST admin - it's gated by ADMIN_BOOTSTRAP_SECRET and does
 * nothing at all if that env var is unset, so it's inert unless deliberately
 * enabled. See .env.example for the operational warning about this endpoint.
 */
@Service
public class AdminAuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final String bootstrapSecret;

    public AdminAuthService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            RefreshTokenService refreshTokenService,
            @Value("${app.admin.bootstrap-secret:}") String bootstrapSecret
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.bootstrapSecret = bootstrapSecret;
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(InvalidCredentialsException::new);

        if (user.getPasswordHash() == null
                || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }

        // Deliberately the SAME exception as a bad password - never reveal that an
        // account exists but simply isn't an admin.
        if (!user.hasRole(RoleName.ROLE_ADMIN)) {
            throw new InvalidCredentialsException();
        }

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = refreshTokenService.issue(user);
        return AuthResponse.bearer(accessToken, refreshToken, jwtService.getAccessTokenTtlSeconds(), user);
    }

    @Transactional
    public void bootstrap(String email, String providedSecret) {
        if (bootstrapSecret.isBlank() || !bootstrapSecret.equals(providedSecret)) {
            throw new AdminBootstrapException();
        }

        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(AdminBootstrapException::new);

        if (!user.hasRole(RoleName.ROLE_ADMIN)) {
            Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
                    .orElseThrow(() -> new IllegalStateException(
                            "Role ROLE_ADMIN is missing from the database - check V1 migration ran"));
            user.getRoles().add(adminRole);
            userRepository.save(user);
        }
    }
}
