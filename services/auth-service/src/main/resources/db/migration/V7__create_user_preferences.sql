-- Globalization Phase A: three-tier language/timezone/country preferences.
-- One row per (user_id, scope): GLOBAL is the account-level default, always
-- read even when no row exists yet (see UserPreferenceService - reads never
-- write, so a fresh user has zero rows and everything resolves to the
-- hardcoded platform default). CUSTOMER/ORGANIZER rows are optional
-- persona-scoped overrides for a dual-role account, only created the first
-- time that persona explicitly sets something different from GLOBAL.
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    scope VARCHAR(20) NOT NULL,
    language VARCHAR(10),
    timezone VARCHAR(50),
    country VARCHAR(2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_user_preferences_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_user_preferences_user_scope UNIQUE (user_id, scope)
);

ALTER TABLE user_preferences ADD CONSTRAINT chk_user_preferences_scope
    CHECK (scope IN ('GLOBAL', 'CUSTOMER', 'ORGANIZER'));

-- Every read goes through findByUserIdAndScope - this is the only access path.
CREATE INDEX idx_user_preferences_user_scope ON user_preferences(user_id, scope);
