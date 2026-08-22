package com.grabmyticket.event.service;

/** String constants, not an enum - same reasoning as every other service's AuditActions: a new privileged action here never needs a migration. */
public final class AuditActions {

    private AuditActions() {
    }

    public static final String EVENT_FLAGGED = "EVENT_FLAGGED";
    public static final String EVENT_UNFLAGGED = "EVENT_UNFLAGGED";
    public static final String EVENT_REMOVED = "EVENT_REMOVED";
    public static final String EVENT_RESTORED = "EVENT_RESTORED";

    /** Phase 9 (account deletion): actorId on these two is the ORGANIZER whose profile deletion triggered the cleanup, not an admin - AdminAuditLog is reused here as a general privileged-action log, not an admin-only one (see AdminAuditLogRepository). */
    public static final String EVENT_ARCHIVED_ON_ACCOUNT_DELETION = "EVENT_ARCHIVED_ON_ACCOUNT_DELETION";
    public static final String EVENT_CANCELLED_ON_ACCOUNT_DELETION = "EVENT_CANCELLED_ON_ACCOUNT_DELETION";

    public static final String TARGET_EVENT = "EVENT";
}
