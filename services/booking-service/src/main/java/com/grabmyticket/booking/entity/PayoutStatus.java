package com.grabmyticket.booking.entity;

/**
 * REQUESTED -> APPROVED -> PAID is the happy path. REJECTED and FAILED are
 * terminal but distinct: REJECTED means an admin declined it before any
 * money moved (organizer can request again); FAILED means payment-service's
 * Razorpay Route call itself failed after approval (Phase 2c sets this, not
 * this service directly - booking-service only ever sets REQUESTED,
 * APPROVED, REJECTED; PAID/FAILED arrive via the payout.completed/
 * payout.failed Kafka event once that consumer exists).
 */
public enum PayoutStatus {
    REQUESTED,
    APPROVED,
    REJECTED,
    PAID,
    FAILED
}
