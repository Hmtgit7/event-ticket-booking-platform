CREATE TABLE cancellation_requests (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id    UUID NOT NULL,
    user_id       UUID NOT NULL,
    reason        VARCHAR(500) NOT NULL,
    status        VARCHAR(10) NOT NULL DEFAULT 'REQUESTED',
    refund_amount NUMERIC(12, 2),
    reviewed_by   UUID,
    review_note   VARCHAR(500),
    reviewed_at   TIMESTAMPTZ,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_cancellation_requests_status CHECK (status IN ('REQUESTED', 'APPROVED', 'REJECTED'))
);

CREATE INDEX idx_cancellation_requests_booking_id ON cancellation_requests(booking_id);
CREATE INDEX idx_cancellation_requests_user_id ON cancellation_requests(user_id);
CREATE INDEX idx_cancellation_requests_status ON cancellation_requests(status);

-- Only one OPEN (REQUESTED) cancellation request per booking at a time -
-- enforced at the DB level, not just application logic, since this is a
-- money-adjacent invariant worth a hard guarantee.
CREATE UNIQUE INDEX uq_cancellation_requests_open_booking
    ON cancellation_requests(booking_id)
    WHERE status = 'REQUESTED';
