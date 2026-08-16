-- Append-only. No FK to users(id) for actor_id/target_id by convention
-- (every entity in this schema already avoids FKs to keep migrations
-- reorderable and services decoupled) - both are just UUIDs resolved by
-- the admin panel joining against /admin/users when it renders this.
CREATE TABLE admin_audit_log (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id    UUID NOT NULL,
    action      VARCHAR(60) NOT NULL,
    target_type VARCHAR(40) NOT NULL,
    target_id   UUID,
    reason      VARCHAR(500),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_admin_audit_log_created_at ON admin_audit_log(created_at DESC);
CREATE INDEX idx_admin_audit_log_actor_id ON admin_audit_log(actor_id);
