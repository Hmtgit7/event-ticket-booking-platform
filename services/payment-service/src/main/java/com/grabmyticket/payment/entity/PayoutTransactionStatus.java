package com.grabmyticket.payment.entity;

/** INITIATED = Razorpay Payout API call is in flight or was accepted as queued. COMPLETED/FAILED are set from the API response (Payouts are often synchronous for IMPS, but Razorpay can also return "queued" - treat that as INITIATED until a webhook or later reconciliation confirms it, not built yet). */
public enum PayoutTransactionStatus {
    INITIATED,
    COMPLETED,
    FAILED
}
