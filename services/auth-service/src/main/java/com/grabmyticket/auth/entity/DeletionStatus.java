package com.grabmyticket.auth.entity;

/**
 * ACTIVE - normal account, nothing pending.
 * PENDING_DELETION - grace period running (see AccountDeletionReaper); user can still
 * log in during this window only to cancel, everything else is blocked by issueTokenPair
 * the same way a suspended account is - actually not blocked from login itself, just
 * flagged, see AccountDeletionService for the exact behavior.
 * DELETED - grace period elapsed, finalized: roles removed and (for FULL_ACCOUNT scope,
 * or a persona removal that left zero roles) PII anonymized. The row itself is kept,
 * never hard-deleted - see V6 migration's comment for why.
 */
public enum DeletionStatus {
    ACTIVE,
    PENDING_DELETION,
    DELETED
}
