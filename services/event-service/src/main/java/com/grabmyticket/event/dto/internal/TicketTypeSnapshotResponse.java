package com.grabmyticket.event.dto.internal;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import com.grabmyticket.event.entity.EventStatus;

/** What booking-service needs to validate + price a booking before it touches the wallet. Internal contract, not exposed publicly. */
public record TicketTypeSnapshotResponse(
        UUID ticketTypeId,
        UUID eventId,
        UUID organizerId,
        String eventTitle,
        Instant eventStartAt,
        String eventBannerUrl,
        EventStatus eventStatus,
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
