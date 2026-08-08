package com.grabmyticket.event.dto.internal;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record SeatAdjustmentRequest(
        @NotNull @Min(value = 1, message = "quantity must be at least 1") Integer quantity
) {
}
