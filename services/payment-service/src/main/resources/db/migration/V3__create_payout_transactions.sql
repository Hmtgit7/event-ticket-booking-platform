-- Payment-side counterpart to booking-service's payout_requests. Unique
-- constraint on payout_request_id is the idempotency guard against a
-- redelivered payout.approved Kafka event firing a second Razorpay Payout.
CREATE TABLE payout_transactions (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payout_request_id UUID NOT NULL UNIQUE,
    organizer_id       UUID NOT NULL,
    amount             NUMERIC(12, 2) NOT NULL,
    status             VARCHAR(10) NOT NULL DEFAULT 'INITIATED',
    razorpay_payout_id VARCHAR(64) UNIQUE,
    failure_reason     VARCHAR(255),
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_payout_transactions_status CHECK (status IN ('INITIATED', 'COMPLETED', 'FAILED')),
    CONSTRAINT chk_payout_transactions_amount_positive CHECK (amount > 0)
);

CREATE INDEX idx_payout_transactions_organizer_id ON payout_transactions(organizer_id);
