package com.grabmyticket.payment.event;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import com.grabmyticket.payment.entity.PaymentPurpose;

/**
 * Plain JSON contract for booking-service's (and later notification-service's)
 * Kafka consumer. eventType is the discriminator a polyglot consumer reads -
 * same pattern as booking-service's BookingConfirmedEvent. paymentTransactionId
 * is what the consumer uses as WalletTransaction.referenceId, and is also the
 * idempotency key - a consumer must check it hasn't already applied this id
 * before crediting anything, since Razorpay webhook retries mean this event
 * can be published more than once for the same payment.
 */
public record PaymentCompletedEvent(
        String eventType,
        UUID paymentTransactionId,
        UUID userId,
        PaymentPurpose purpose,
        BigDecimal amount,
        String currency,
        String razorpayPaymentId,
        Instant completedAt
) {
    public static final String TYPE = "payment.completed";
}
