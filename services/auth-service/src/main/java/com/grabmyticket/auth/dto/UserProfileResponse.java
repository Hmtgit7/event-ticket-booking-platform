package com.grabmyticket.auth.dto;

import java.time.Instant;
import java.util.Set;
import java.util.stream.Collectors;

import com.grabmyticket.auth.entity.DeletionScope;
import com.grabmyticket.auth.entity.DeletionStatus;
import com.grabmyticket.auth.entity.Role;
import com.grabmyticket.auth.entity.User;

public record UserProfileResponse(
        String userId,
        String email,
        String fullName,
        boolean emailVerified,
        boolean rolePromptSeen,
        boolean hasPassword,
        String activePersona,
        Set<String> roles,
        /** ACTIVE unless a deletion request is pending/finalized - see AccountDeletionController. */
        DeletionStatus deletionStatus,
        /** Null unless deletionStatus is PENDING_DELETION or DELETED. */
        DeletionScope deletionScope,
        /** Null unless deletionStatus is PENDING_DELETION - drives the app-wide "scheduled for deletion" banner. */
        Instant deletionScheduledFor
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
                user.getActivePersona(),
                roleNames,
                user.getDeletionStatus(),
                user.getDeletionScope(),
                user.getDeletionScheduledFor()
        );
    }
}
