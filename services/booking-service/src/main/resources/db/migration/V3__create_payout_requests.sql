-- Separate table from wallet_transactions on purpose - organizers have no
-- wallet, this is a marketplace-settlement request lifecycle, not a spend-
-- credit ledger. organizer_id is NOT a FK to auth-service's users table
-- (no cross-service FK, same rule as everywhere else in this schema).
CREATE TABLE payout_requests (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organizer_id       UUID NOT NULL,
    amount             NUMERIC(12, 2) NOT NULL,
    status             VARCHAR(10) NOT NULL DEFAULT 'REQUESTED',
    reviewed_by        UUID,
    review_note        VARCHAR(500),
    reviewed_at        TIMESTAMPTZ,
    razorpay_payout_id VARCHAR(64),
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_payout_requests_status CHECK (status IN ('REQUESTED', 'APPROVED', 'REJECTED', 'PAID', 'FAILED')),
    CONSTRAINT chk_payout_requests_amount_positive CHECK (amount > 0)
);

CREATE INDEX idx_payout_requests_organizer_id ON payout_requests(organizer_id);
CREATE INDEX idx_payout_requests_status ON payout_requests(status);
