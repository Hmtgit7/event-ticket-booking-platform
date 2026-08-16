package com.grabmyticket.event.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import com.grabmyticket.event.entity.EventStatus;

public record EventResponse(
        UUID id,
        UUID organizerId,
        String title,
        String slug,
        String category,
        String description,
        String venueName,
        String address,
        String city,
        Double latitude,
        Double longitude,
        Instant startAt,
        Instant endAt,
        String bannerImageUrl,
        String bannerPublicId,
        EventStatus status,
        Instant publishedAt,
        /** Only non-null when status is FLAGGED or REMOVED - see Event.moderationReason. */
        String moderationReason,
        List<TicketTypeResponse> ticketTypes,
        Instant createdAt,
        Instant updatedAt
) {
}
