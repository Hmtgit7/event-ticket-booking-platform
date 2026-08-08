-- One wallet per user (user_id references auth-service's users.id -
-- no FK across services, each service owns its own DB).
CREATE TABLE wallets (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL UNIQUE,
    balance     NUMERIC(12, 2) NOT NULL DEFAULT 0,
    currency    VARCHAR(3) NOT NULL DEFAULT 'INR',
    version     BIGINT NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_wallets_balance_nonneg CHECK (balance >= 0)
);

-- Append-only ledger - this table IS the transaction history feed.
CREATE TABLE wallet_transactions (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id      UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    type           VARCHAR(10) NOT NULL,
    amount         NUMERIC(12, 2) NOT NULL,
    balance_after  NUMERIC(12, 2) NOT NULL,
    reason         VARCHAR(30) NOT NULL,
    status         VARCHAR(10) NOT NULL DEFAULT 'COMPLETED',
    description    VARCHAR(255) NOT NULL,
    reference_id   UUID,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_wallet_txn_type CHECK (type IN ('CREDIT', 'DEBIT')),
    CONSTRAINT chk_wallet_txn_reason CHECK (reason IN ('RECHARGE', 'BOOKING_PAYMENT', 'BOOKING_REFUND')),
    CONSTRAINT chk_wallet_txn_status CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED')),
    CONSTRAINT chk_wallet_txn_amount_positive CHECK (amount > 0)
);

-- A confirmed (or attempted) ticket purchase. event_id/ticket_type_id
-- reference event-service's tables with no cross-service FK.
CREATE TABLE bookings (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_code      VARCHAR(20) NOT NULL UNIQUE,
    user_id           UUID NOT NULL,
    event_id          UUID NOT NULL,
    ticket_type_id    UUID NOT NULL,
    event_title       VARCHAR(200) NOT NULL,
    event_start_at    TIMESTAMPTZ NOT NULL,
    event_banner_url  VARCHAR(500),
    ticket_type_name  VARCHAR(100) NOT NULL,
    quantity          INTEGER NOT NULL,
    unit_price        NUMERIC(10, 2) NOT NULL,
    total_amount      NUMERIC(12, 2) NOT NULL,
    status            VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    cancelled_at      TIMESTAMPTZ,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_bookings_status CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'FAILED')),
    CONSTRAINT chk_bookings_quantity_positive CHECK (quantity > 0),
    CONSTRAINT chk_bookings_unit_price_nonneg CHECK (unit_price >= 0)
);

CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX idx_wallet_transactions_created_at ON wallet_transactions(created_at);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_event_id ON bookings(event_id);
CREATE INDEX idx_bookings_status ON bookings(status);
