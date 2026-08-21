package com.grabmyticket.booking.client;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Mirrors event-service's TicketTypeSnapshotResponse field-for-field for JSON
 * deserialization. Deliberately a separate copy, not a shared library - each
 * service stays independently deployable (see JwtVerifier's comment on the
 * same tradeoff for the JWT filter).
 */
public record TicketTypeSnapshot(
        UUID ticketTypeId,
        UUID eventId,
        UUID organizerId,
        String eventTitle,
        Instant eventStartAt,
        String eventBannerUrl,
        String eventStatus,
        String ticketTypeName,
        BigDecimal price,
        Integer quantityAvailable,
        Instant salesStart,
        Instant salesEnd,
        String venueName,
        String address,
        String city
) {
}
