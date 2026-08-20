package com.grabmyticket.booking.entity;

/** OPEN -> IN_PROGRESS -> RESOLVED, with CLOSED as a separate terminal state for tickets closed without resolution (duplicate, no longer relevant, etc.) - distinct from RESOLVED so admin reporting can tell "we fixed it" from "we didn't need to". */
public enum SupportTicketStatus {
    OPEN,
    IN_PROGRESS,
    RESOLVED,
    CLOSED
}
