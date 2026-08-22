package com.grabmyticket.auth.dto;

import java.time.Instant;

import com.grabmyticket.auth.entity.DeletionScope;
import com.grabmyticket.auth.entity.DeletionStatus;
import com.grabmyticket.auth.entity.User;

public record AccountDeletionStatusResponse(
        DeletionStatus status,
        DeletionScope scope,
        Instant requestedAt,
        Instant scheduledFor
) {
    public static AccountDeletionStatusResponse from(User user) {
        return new AccountDeletionStatusResponse(
                user.getDeletionStatus(),
                user.getDeletionScope(),
                user.getDeletionRequestedAt(),
                user.getDeletionScheduledFor());
    }
}
