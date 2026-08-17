package com.grabmyticket.booking.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateCancellationRequest(
        @NotBlank(message = "reason is required")
        String reason
) {
}
