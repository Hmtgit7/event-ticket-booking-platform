ALTER TABLE users ADD COLUMN enabled BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE users ADD COLUMN suspension_reason VARCHAR(500);
ALTER TABLE users ADD COLUMN suspended_by UUID;
ALTER TABLE users ADD COLUMN suspended_at TIMESTAMPTZ;

CREATE INDEX idx_users_enabled ON users(enabled);
