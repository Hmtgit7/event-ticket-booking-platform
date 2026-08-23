package com.grabmyticket.auth.event;

import java.time.Instant;
import java.util.UUID;

import com.grabmyticket.auth.entity.DeletionScope;

/**
 * Published when AccountDeletionReaper finalizes a CUSTOMER or ORGANIZER
 * profile deletion on a dual-role account that keeps working afterward (the
 * account stays ACTIVE, just missing one role) - distinct from
 * AccountDeletedEvent, which is the account-is-gone case. Lets
 * notification-service send a lighter "your organizer profile was removed"
 * notice instead of a final goodbye, and never suppress future emails for
 * this user since the account is still very much alive.
 */
public record PersonaRemovedEvent(
        String eventType,
        UUID userId,
        String email,
        String fullName,
        DeletionScope scope,
        Instant removedAt
) {
    public static final String TYPE = "user.persona.removed";
}
