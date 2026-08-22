package com.grabmyticket.auth.service;

/**
 * String constants, not an enum - deliberately, so a new privileged action
 * anywhere in this service is just a new constant here, never a migration
 * or a change to AdminAuditLog itself (see its class comment). Target types
 * follow the same convention.
 */
public final class AuditActions {

    private AuditActions() {
    }

    public static final String ROLE_GRANTED = "ROLE_GRANTED";
    public static final String ROLE_REVOKED = "ROLE_REVOKED";
    public static final String ADMIN_BOOTSTRAPPED = "ADMIN_BOOTSTRAPPED";
    public static final String USER_SUSPENDED = "USER_SUSPENDED";
    public static final String USER_REINSTATED = "USER_REINSTATED";
    public static final String USER_PII_VIEWED = "USER_PII_VIEWED";

    /** Phase 9: account/profile deletion - self-service, actorId is the account holder themselves except ACCOUNT_DELETION_FINALIZED/ACCOUNT_DELETION_BLOCKED which come from AccountDeletionReaper (a scheduled job, not a human actor - actorId is still the affected user's own id there, same as ACCOUNT_DELETION_REQUESTED). */
    public static final String ACCOUNT_DELETION_REQUESTED = "ACCOUNT_DELETION_REQUESTED";
    public static final String ACCOUNT_DELETION_CANCELLED = "ACCOUNT_DELETION_CANCELLED";
    public static final String ACCOUNT_DELETION_FINALIZED = "ACCOUNT_DELETION_FINALIZED";
    public static final String ACCOUNT_DELETION_BLOCKED = "ACCOUNT_DELETION_BLOCKED";

    public static final String TARGET_USER = "USER";
}
