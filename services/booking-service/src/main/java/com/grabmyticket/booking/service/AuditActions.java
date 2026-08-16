package com.grabmyticket.booking.service;

/** String constants, not an enum - same reasoning as auth-service's AuditActions: a new privileged action here never needs a migration. */
public final class AuditActions {

    private AuditActions() {
    }

    public static final String PAYOUT_APPROVED = "PAYOUT_APPROVED";
    public static final String PAYOUT_REJECTED = "PAYOUT_REJECTED";

    public static final String TARGET_PAYOUT_REQUEST = "PAYOUT_REQUEST";
}
