package com.grabmyticket.auth.dto;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import com.grabmyticket.auth.entity.Role;
import com.grabmyticket.auth.entity.User;

/** List-view shape for GET /admin/users - lighter than AdminUserDetailResponse, same split as EventSummaryResponse/EventResponse elsewhere. */
public record AdminUserSummaryResponse(
        UUID id,
        String email,
        String fullName,
        Set<String> roles,
        boolean enabled,
        boolean emailVerified,
        Instant createdAt
) {
    public static AdminUserSummaryResponse from(User user) {
        Set<String> roleNames = user.getRoles().stream().map(Role::getName).collect(Collectors.toSet());
        return new AdminUserSummaryResponse(
                user.getId(), user.getEmail(), user.getFullName(), roleNames,
                user.isEnabled(), user.isEmailVerified(), user.getCreatedAt());
    }
}
