package com.grabmyticket.booking.dto;

import java.util.UUID;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CreateBookingRequest(
        @NotNull UUID eventId,
        @NotNull UUID ticketTypeId,
        @NotNull @Min(value = 1, message = "quantity must be at least 1") Integer quantity
) {
}
