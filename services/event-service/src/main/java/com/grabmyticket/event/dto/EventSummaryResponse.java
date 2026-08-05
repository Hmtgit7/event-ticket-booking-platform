package com.grabmyticket.event.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import com.grabmyticket.event.entity.EventStatus;

/** Lighter shape for list/browse views (organizer's "My Events" and the public listing). */
public record EventSummaryResponse(
        UUID id,
        String title,
        String slug,
        String category,
        String venueName,
        String city,
        Instant startAt,
        Instant endAt,
        String bannerImageUrl,
        EventStatus status,
        /** Lowest ticket tier price - null if the event has no ticket types yet (still-editing draft). */
        BigDecimal fromPrice
) {
}
