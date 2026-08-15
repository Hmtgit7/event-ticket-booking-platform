-- One row per organizer (unique organizer_id) - their Razorpay payout
-- destination. Deliberately no bank_account_number column, only the last 4
-- digits - the full number is sent to Razorpay once (to create the Fund
-- Account) and never stored here, per DPDP data-minimization.
CREATE TABLE organizer_payout_accounts (
    id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organizer_id             UUID NOT NULL UNIQUE,
    account_holder_name      VARCHAR(120) NOT NULL,
    bank_account_last4       VARCHAR(4) NOT NULL,
    ifsc_code                VARCHAR(11) NOT NULL,
    status                   VARCHAR(10) NOT NULL DEFAULT 'PENDING',
    razorpay_contact_id      VARCHAR(64),
    razorpay_fund_account_id VARCHAR(64),
    failure_reason           VARCHAR(255),
    created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at               TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_organizer_payout_accounts_status CHECK (status IN ('PENDING', 'ACTIVE', 'FAILED'))
);
