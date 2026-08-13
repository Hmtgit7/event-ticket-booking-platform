package com.grabmyticket.booking.event;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Read-side copy of payment-service's PaymentCompletedEvent contract -
 * deliberately duplicated rather than shared as a library, same reasoning as
 * every other cross-service DTO in this monorepo (independent deployability).
 * purpose is a plain String here, not payment-service's PaymentPurpose enum -
 * this service only needs to check it equals "WALLET_RECHARGE", it has no
 * business knowing payment-service's full enum.
 */
public record PaymentCompletedEvent(
        String eventType,
        UUID paymentTransactionId,
        UUID userId,
        String purpose,
        BigDecimal amount,
        String currency,
        String razorpayPaymentId,
        Instant completedAt
) {
    public static final String TYPE = "payment.completed";
    public static final String PURPOSE_WALLET_RECHARGE = "WALLET_RECHARGE";
}
