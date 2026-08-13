package com.grabmyticket.payment.entity;

/**
 * Lifecycle of one PaymentTransaction. CREATED = Razorpay order exists, user
 * hasn't paid yet. COMPLETED/FAILED are set only from the verified webhook
 * callback - never from the order-creation response, since that only proves
 * an order was opened, not that money moved.
 */
public enum PaymentStatus {
    CREATED,
    COMPLETED,
    FAILED
}
