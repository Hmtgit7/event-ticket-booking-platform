package com.grabmyticket.booking.dto;

import java.time.Instant;
import java.util.UUID;

import com.grabmyticket.booking.entity.RelatedEntityType;
import com.grabmyticket.booking.entity.SupportTicketCategory;
import com.grabmyticket.booking.entity.SupportTicketPriority;
import com.grabmyticket.booking.entity.SupportTicketStatus;

public record SupportTicketResponse(
        UUID id,
        UUID userId,
        String subject,
        String description,
        SupportTicketCategory category,
        SupportTicketStatus status,
        SupportTicketPriority priority,
        RelatedEntityType relatedEntityType,
        UUID relatedEntityId,
        String resolutionNote,
        UUID assignedAdminId,
        Instant createdAt,
        Instant updatedAt
) {
}
