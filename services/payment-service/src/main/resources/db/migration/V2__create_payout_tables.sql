-- Raw bank account number is deliberately NOT a column here - Razorpay is
-- the system of record for it (via razorpay_fund_account_id). Only the last
-- 4 digits are kept, for the organizer to visually confirm which account is
-- on file.
CREATE TABLE organizer_payout_accounts (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organizer_id            UUID NOT NULL UNIQUE,
    account_holder_name     VARCHAR(100) NOT NULL,
    masked_account_number   VARCHAR(8) NOT NULL,
    ifsc_code               VARCHAR(11) NOT NULL,
    razorpay_contact_id     VARCHAR(64) NOT NULL,
    razorpay_fund_account_id VARCHAR(64) NOT NULL,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- This service's own record of every Razorpay payout it ever attempted -
-- payout_request_id (booking-service's PayoutRequest.id) uniqueness is what
-- makes a redelivered payout.approved Kafka event a no-op instead of a
-- duplicate transfer.
CREATE TABLE payout_transactions (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payout_request_id UUID NOT NULL UNIQUE,
    organizer_id       UUID NOT NULL,
    amount             NUMERIC(12, 2) NOT NULL,
    status             VARCHAR(10) NOT NULL,
    razorpay_payout_id VARCHAR(64) UNIQUE,
    failure_reason     VARCHAR(255),
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_payout_transactions_status CHECK (status IN ('INITIATED', 'FAILED')),
    CONSTRAINT chk_payout_transactions_amount_positive CHECK (amount > 0)
);

CREATE INDEX idx_payout_transactions_organizer_id ON payout_transactions(organizer_id);
