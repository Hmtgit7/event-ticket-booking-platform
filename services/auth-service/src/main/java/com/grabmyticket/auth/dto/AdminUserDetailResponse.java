package com.grabmyticket.auth.dto;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import com.grabmyticket.auth.entity.Role;
import com.grabmyticket.auth.entity.User;

/**
 * Full detail shape for GET /admin/users/{id} - includes suspension state
 * and PII (email, full name) an admin is viewing directly. Every call to
 * this endpoint is itself access-logged (see AdminUserService.getUser) per
 * the DPDP principle that admin access to another user's PII should be
 * attributable, not just the mutations.
 */
public record AdminUserDetailResponse(
        UUID id,
        String email,
        String fullName,
        Set<String> roles,
        boolean enabled,
        boolean emailVerified,
        String activePersona,
        String suspensionReason,
        UUID suspendedBy,
        Instant suspendedAt,
        Instant createdAt
) {
    public static AdminUserDetailResponse from(User user) {
        Set<String> roleNames = user.getRoles().stream().map(Role::getName).collect(Collectors.toSet());
        return new AdminUserDetailResponse(
                user.getId(), user.getEmail(), user.getFullName(), roleNames,
                user.isEnabled(), user.isEmailVerified(), user.getActivePersona(),
                user.getSuspensionReason(), user.getSuspendedBy(), user.getSuspendedAt(),
                user.getCreatedAt());
    }
}
