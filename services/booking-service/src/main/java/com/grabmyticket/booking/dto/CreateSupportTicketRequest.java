package com.grabmyticket.booking.dto;

import java.util.UUID;

import com.grabmyticket.booking.entity.RelatedEntityType;
import com.grabmyticket.booking.entity.SupportTicketCategory;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateSupportTicketRequest(
        @NotBlank(message = "subject is required")
        String subject,

        @NotBlank(message = "description is required")
        String description,

        @NotNull(message = "category is required")
        SupportTicketCategory category,

        /** Optional - null for general issues with nothing specific to link to. */
        RelatedEntityType relatedEntityType,
        UUID relatedEntityId
) {
}
