package com.grabmyticket.auth.event;

import java.time.Instant;
import java.util.UUID;

/**
 * Published when AccountDeletionReaper finalizes a FULL_ACCOUNT deletion (or
 * a CUSTOMER/ORGANIZER deletion that happened to leave zero roles). email/
 * fullName are the PRE-anonymization values, captured before
 * AccountDeletionService.anonymize() overwrites them - the event payload is
 * self-contained precisely so notification-service can send a final
 * confirmation without needing to read the now-anonymized row back.
 *
 * Plain JSON contract for notification-service's Kafka consumer, same
 * convention as booking-service's BookingConfirmedEvent - eventType is the
 * discriminator a polyglot consumer reads, not a Kafka header or class name.
 */
public record AccountDeletedEvent(
        String eventType,
        UUID userId,
        String email,
        String fullName,
        Instant deletedAt
) {
    public static final String TYPE = "user.account.deleted";
}
