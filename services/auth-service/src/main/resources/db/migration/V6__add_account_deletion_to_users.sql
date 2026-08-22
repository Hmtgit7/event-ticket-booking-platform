-- Phase 9: account/profile deletion. Deliberately NOT a hard delete anywhere -
-- deletion_status DELETED means "roles removed + PII anonymized", the row
-- itself is kept forever so financial records elsewhere (bookings, wallet
-- transactions, payouts) still have a valid, if meaningless, userId to point
-- at - see InternalUserDeletionService's class comment in booking-service.
ALTER TABLE users
    ADD COLUMN deletion_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    ADD COLUMN deletion_scope VARCHAR(20),
    ADD COLUMN deletion_requested_at TIMESTAMPTZ,
    ADD COLUMN deletion_scheduled_for TIMESTAMPTZ,
    ADD COLUMN deleted_at TIMESTAMPTZ;

ALTER TABLE users ADD CONSTRAINT chk_users_deletion_status
    CHECK (deletion_status IN ('ACTIVE', 'PENDING_DELETION', 'DELETED'));
ALTER TABLE users ADD CONSTRAINT chk_users_deletion_scope
    CHECK (deletion_scope IS NULL OR deletion_scope IN ('CUSTOMER', 'ORGANIZER', 'FULL_ACCOUNT'));

-- Partial index - the reaper only ever queries PENDING_DELETION rows, and
-- almost every row will be ACTIVE forever, so indexing the whole column
-- would be pure overhead.
CREATE INDEX idx_users_deletion_status_pending ON users(deletion_scheduled_for)
    WHERE deletion_status = 'PENDING_DELETION';
