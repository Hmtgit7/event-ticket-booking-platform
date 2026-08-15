package com.grabmyticket.booking.event;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/** Read-side copy of payment-service's PayoutExecutedEvent. status is a plain String ("PAID"/"FAILED"), not an enum shared across services - same reasoning as PaymentCompletedEvent.purpose. */
public record PayoutExecutedEvent(
        String eventType,
        UUID payoutRequestId,
        UUID organizerId,
        BigDecimal amount,
        String status,
        String razorpayPayoutId,
        String failureReason,
        Instant executedAt
) {
    public static final String TYPE = "payout.executed";
    public static final String STATUS_PAID = "PAID";
    public static final String STATUS_FAILED = "FAILED";
}
