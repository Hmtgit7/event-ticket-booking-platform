-- This service's own record of every Razorpay order it ever created - the
-- source of truth for whether money actually moved, independent of any
-- other service's ledger. razorpay_order_id/razorpay_payment_id uniqueness
-- is what makes a retried webhook a no-op instead of a double-credit.
CREATE TABLE payment_transactions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL,
    purpose             VARCHAR(30) NOT NULL,
    amount              NUMERIC(12, 2) NOT NULL,
    currency            VARCHAR(3) NOT NULL DEFAULT 'INR',
    status              VARCHAR(10) NOT NULL DEFAULT 'CREATED',
    razorpay_order_id   VARCHAR(64) NOT NULL UNIQUE,
    razorpay_payment_id VARCHAR(64) UNIQUE,
    failure_reason      VARCHAR(255),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_payment_transactions_purpose CHECK (purpose IN ('WALLET_RECHARGE')),
    CONSTRAINT chk_payment_transactions_status CHECK (status IN ('CREATED', 'COMPLETED', 'FAILED')),
    CONSTRAINT chk_payment_transactions_amount_positive CHECK (amount > 0)
);

CREATE INDEX idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);
