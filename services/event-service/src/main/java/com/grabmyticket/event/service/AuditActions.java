package com.grabmyticket.event.service;

/** String constants, not an enum - same reasoning as every other service's AuditActions: a new privileged action here never needs a migration. */
public final class AuditActions {

    private AuditActions() {
    }

    public static final String EVENT_FLAGGED = "EVENT_FLAGGED";
    public static final String EVENT_UNFLAGGED = "EVENT_UNFLAGGED";
    public static final String EVENT_REMOVED = "EVENT_REMOVED";
    public static final String EVENT_RESTORED = "EVENT_RESTORED";

    public static final String TARGET_EVENT = "EVENT";
}
