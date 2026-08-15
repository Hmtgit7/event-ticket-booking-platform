package com.grabmyticket.booking.event;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Published to the booking-events topic once an admin approves a payout -
 * this, not the initial request, is what payment-service's Phase 2c
 * consumer will act on by calling Razorpay Route. Requesting a payout never
 * crosses into payment-service; only an approved one does, since that's the
 * point money is actually allowed to move.
 */
public record PayoutApprovedEvent(
        String eventType,
        UUID payoutRequestId,
        UUID organizerId,
        BigDecimal amount,
        Instant approvedAt
) {
    public static final String TYPE = "payout.approved";
}
