package com.grabmyticket.event.dto;

import java.time.Instant;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Single submit from the create-event wizard: basic info + date/location +
 * ticket tiers + banner, all at once. publishImmediately drives whether the
 * event is created as DRAFT or goes straight to PUBLISHED (still validated -
 * see EventService.createEvent).
 */
public record CreateEventRequest(
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
        String bannerPublicId,
        @NotEmpty(message = "At least one ticket type is required") @Valid List<TicketTypeRequest> ticketTypes,
        boolean publishImmediately
) {
}
