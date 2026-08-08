package com.grabmyticket.booking.entity;

/**
 * Why a WalletTransaction happened. Open for extension: new reasons (e.g.
 * PROMO_CREDIT, CANCELLATION_REFUND) can be added later without changing how
 * existing reasons are recorded or displayed - this is a plain data tag, not
 * a branch condition anywhere in wallet debit/credit logic.
 */
public enum TransactionReason {
    RECHARGE,
    BOOKING_PAYMENT,
    BOOKING_REFUND
}
