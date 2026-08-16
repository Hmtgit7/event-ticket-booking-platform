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

    public static final String TARGET_USER = "USER";
}
