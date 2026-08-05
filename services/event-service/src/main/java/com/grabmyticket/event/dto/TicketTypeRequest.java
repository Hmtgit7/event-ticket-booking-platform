package com.grabmyticket.event.dto;

import java.math.BigDecimal;
import java.time.Instant;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TicketTypeRequest(
        @NotBlank @Size(max = 100) String name,
        @NotNull @DecimalMin(value = "0.0", message = "price must not be negative") BigDecimal price,
        @NotNull @Min(value = 1, message = "quantityTotal must be at least 1") Integer quantityTotal,
        Instant salesStart,
        Instant salesEnd
) {
}
