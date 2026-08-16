package com.grabmyticket.event.dto;

import jakarta.validation.constraints.NotBlank;

/** reason is required for both flag and remove - every moderation action needs a reason on record, both for the audit trail and so the organizer isn't left guessing. */
public record ModerateEventRequest(
        @NotBlank(message = "reason is required")
        String reason
) {
}
