package com.grabmyticket.auth.dto;

import java.util.Set;
import java.util.stream.Collectors;

import com.grabmyticket.auth.entity.Role;
import com.grabmyticket.auth.entity.User;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        long expiresIn,
        String userId,
        String email,
        String fullName,
        boolean emailVerified,
        boolean rolePromptSeen,
        Set<String> roles
) {
    public static AuthResponse bearer(String accessToken, String refreshToken, long expiresIn, User user) {
        Set<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        return new AuthResponse(
                accessToken,
                refreshToken,
                "Bearer",
                expiresIn,
                user.getId().toString(),
                user.getEmail(),
                user.getFullName(),
                user.isEmailVerified(),
                user.isRolePromptSeen(),
                roleNames
        );
    }
}
