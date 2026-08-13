package com.grabmyticket.payment.entity;

/**
 * Why this payment exists. WALLET_RECHARGE is the only purpose today;
 * TICKET_PURCHASE (direct checkout, bypassing wallet) and ORGANIZER_PAYOUT
 * (Razorpay Route payout, not an order) land here later without touching
 * existing rows or the code that reads them - open for extension.
 */
public enum PaymentPurpose {
    WALLET_RECHARGE
}
