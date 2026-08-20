package com.grabmyticket.booking.entity;

/** LOW/MEDIUM/HIGH only - deliberately no "urgent"/"critical" tier, keeps admin triage a simple three-way sort rather than a scale nobody agrees on the meaning of. */
public enum SupportTicketPriority {
    LOW,
    MEDIUM,
    HIGH
}
