package com.grabmyticket.event.dto;

import java.time.Instant;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** Full replace of an event's core fields. Ticket tiers are managed separately (see TicketTypeRequest endpoints). */
public record UpdateEventRequest(
        @NotBlank @Size(max = 200) String title,
        @NotBlank @Size(max = 50) String category,
        @NotBlank String description,
        @NotBlank @Size(max = 200) String venueName,
        @NotBlank @Size(max = 255) String address,
        @NotBlank @Size(max = 100) String city,
        Double latitude,
        Double longitude,
        @NotNull @Future Instant startAt,
        @NotNull Instant endAt,
        String bannerImageUrl,
        String bannerPublicId
) {
}
