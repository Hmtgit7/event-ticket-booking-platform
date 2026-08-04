package com.grabmyticket.auth.dto;

import java.util.Set;
import java.util.stream.Collectors;

import com.grabmyticket.auth.entity.Role;
import com.grabmyticket.auth.entity.User;

public record UserProfileResponse(
        String userId,
        String email,
        String fullName,
        boolean emailVerified,
        boolean rolePromptSeen,
        boolean hasPassword,
        Set<String> roles
) {
    public static UserProfileResponse from(User user) {
        Set<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        return new UserProfileResponse(
                user.getId().toString(),
                user.getEmail(),
                user.getFullName(),
                user.isEmailVerified(),
                user.isRolePromptSeen(),
                user.getPasswordHash() != null,
                roleNames
        );
    }
}
