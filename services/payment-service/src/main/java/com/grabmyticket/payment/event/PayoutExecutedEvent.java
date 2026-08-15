package com.grabmyticket.payment.event;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Published to payment-events (same topic as PaymentCompletedEvent) once
 * this service has actually attempted the Razorpay Payout call - status is
 * PAID or FAILED, never anything else. booking-service's PayoutEventListener
 * consumes this to move a PayoutRequest out of APPROVED into its terminal
 * state.
 */
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
