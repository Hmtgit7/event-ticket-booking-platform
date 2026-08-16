package com.grabmyticket.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record SuspendUserRequest(
        @NotBlank(message = "reason is required")
        String reason
) {
}
