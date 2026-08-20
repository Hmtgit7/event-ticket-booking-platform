package com.grabmyticket.booking.entity;

/** Small fixed taxonomy - a Java enum, not free text, since this drives admin triage/filtering and the set is deliberately small and stable. */
public enum SupportTicketCategory {
    REFUND,
    TECHNICAL,
    EVENT_ISSUE,
    PAYMENT,
    OTHER
}
