package com.grabmyticket.booking.entity;

/** REQUESTED -> APPROVED/REJECTED. Approval is terminal and immediately triggers the refund - there's no separate "processing" state since the refund is a wallet credit (instant, internal ledger op), not an external gateway call (see CancellationService's class comment for why). */
public enum CancellationStatus {
    REQUESTED,
    APPROVED,
    REJECTED
}
