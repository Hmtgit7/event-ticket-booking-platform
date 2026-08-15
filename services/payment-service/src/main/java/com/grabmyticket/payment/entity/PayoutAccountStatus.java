package com.grabmyticket.payment.entity;

/** ACTIVE = Razorpay confirmed both the Contact and Fund Account exist and payouts can target it. FAILED = Razorpay rejected something (bad IFSC, etc.) - organizer can retry. Once ACTIVE, further submissions are rejected (see PayoutAccountService) - changing payout bank details silently is a fraud vector, not a self-service action. */
public enum PayoutAccountStatus {
    PENDING,
    ACTIVE,
    FAILED
}
