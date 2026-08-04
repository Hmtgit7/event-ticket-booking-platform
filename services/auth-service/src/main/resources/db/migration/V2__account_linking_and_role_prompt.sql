-- Lets one token table drive verify-email, link-password (Google-only account
-- adding a password), and forgot/reset-password flows, instead of three tables.
ALTER TABLE verification_tokens
    ADD COLUMN purpose VARCHAR(20) NOT NULL DEFAULT 'VERIFY_EMAIL';

CREATE INDEX idx_verification_tokens_user_purpose ON verification_tokens(user_id, purpose);

-- Tracks whether a user has already been shown the "also host events?" prompt
-- after Google sign-in, so it only appears once per account.
ALTER TABLE users
    ADD COLUMN role_prompt_seen BOOLEAN NOT NULL DEFAULT FALSE;

-- Local signups already make this choice explicitly via wantsToOrganize at
-- signup time - never re-prompt them.
UPDATE users SET role_prompt_seen = TRUE WHERE provider = 'LOCAL';
