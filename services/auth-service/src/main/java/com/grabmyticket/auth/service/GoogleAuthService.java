package com.grabmyticket.auth.service;

import java.util.HashSet;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.grabmyticket.auth.entity.AuthProvider;
import com.grabmyticket.auth.entity.Role;
import com.grabmyticket.auth.entity.RoleName;
import com.grabmyticket.auth.entity.User;
import com.grabmyticket.auth.repository.RoleRepository;
import com.grabmyticket.auth.repository.UserRepository;

/**
 * Finds-or-creates the local User for a Google-authenticated identity.
 * Called from OAuth2LoginSuccessHandler once Google's redirect completes.
 */
@Service
public class GoogleAuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public GoogleAuthService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Transactional
    public User findOrCreateUser(String googleSub, String email, String fullName) {
        String normalizedEmail = email.trim().toLowerCase();

        return userRepository.findByProviderAndProviderId(AuthProvider.GOOGLE, googleSub)
                .orElseGet(() -> userRepository.findByEmail(normalizedEmail)
                        .map(existing -> linkGoogleIdentity(existing, googleSub))
                        .orElseGet(() -> createGoogleUser(normalizedEmail, fullName, googleSub))
                );
    }

    /**
     * A LOCAL (email/password) account with this email already exists and is now
     * signing in with Google for the first time - link the identities instead of
     * creating a duplicate (email is unique, so a duplicate isn't even possible,
     * but we still want THIS to be the path taken, not an error).
     * We deliberately do NOT change provider away from LOCAL here - they can still
     * log in with their password too. Google having verified this email is still
     * useful trust signal, so we upgrade emailVerified if it wasn't already true.
     */
    private User linkGoogleIdentity(User existing, String googleSub) {
        existing.setProviderId(googleSub);
        if (!existing.isEmailVerified()) {
            existing.setEmailVerified(true);
        }
        return userRepository.save(existing);
    }

    private User createGoogleUser(String email, String fullName, String googleSub) {
        Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                .orElseThrow(() -> new IllegalStateException(
                        "Role ROLE_USER is missing from the database - check V1 migration ran"));

        Set<Role> roles = new HashSet<>();
        roles.add(userRole);

        User user = User.builder()
                .email(email)
                .fullName(fullName != null && !fullName.isBlank() ? fullName : email)
                .provider(AuthProvider.GOOGLE)
                .providerId(googleSub)
                // Google already verified ownership of this email - no verification email needed.
                .emailVerified(true)
                .roles(roles)
                .build();

        return userRepository.save(user);
    }
}
