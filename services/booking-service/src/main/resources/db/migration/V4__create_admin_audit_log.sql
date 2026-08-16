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
