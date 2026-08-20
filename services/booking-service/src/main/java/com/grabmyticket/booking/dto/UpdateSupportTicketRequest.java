package com.grabmyticket.booking.dto;

import java.util.UUID;

import com.grabmyticket.booking.entity.SupportTicketPriority;
import com.grabmyticket.booking.entity.SupportTicketStatus;

/** All fields optional - PATCH semantics, admin sends only what they're changing. At least status or priority should be present in practice, but nothing here enforces that; an empty patch is just a no-op. */
public record UpdateSupportTicketRequest(
        SupportTicketStatus status,
        SupportTicketPriority priority,
        String resolutionNote,
        UUID assignedAdminId
) {
}
