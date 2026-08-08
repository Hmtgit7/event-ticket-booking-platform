package com.grabmyticket.booking.entity;

/**
 * Lifecycle of a single wallet ledger entry. Dummy recharge/booking flows
 * complete synchronously today (straight to COMPLETED), but the state exists
 * now so a real payment gateway (Razorpay) can land later as a new code path
 * that also writes PENDING/FAILED rows - without changing this enum or
 * anything that already reads it.
 */
public enum TransactionStatus {
    PENDING,
    COMPLETED,
    FAILED
}
