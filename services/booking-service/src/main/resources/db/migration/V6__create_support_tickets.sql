CREATE TABLE support_tickets (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL,
    subject             VARCHAR(200) NOT NULL,
    description         TEXT NOT NULL,
    category            VARCHAR(20) NOT NULL,
    status              VARCHAR(15) NOT NULL DEFAULT 'OPEN',
    priority            VARCHAR(10) NOT NULL DEFAULT 'MEDIUM',
    related_entity_type VARCHAR(25),
    related_entity_id   UUID,
    resolution_note     VARCHAR(1000),
    assigned_admin_id   UUID,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_support_tickets_category CHECK (category IN ('REFUND', 'TECHNICAL', 'EVENT_ISSUE', 'PAYMENT', 'OTHER')),
    CONSTRAINT chk_support_tickets_status CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
    CONSTRAINT chk_support_tickets_priority CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
    CONSTRAINT chk_support_tickets_related_entity_type CHECK (related_entity_type IS NULL OR related_entity_type IN ('BOOKING', 'PAYOUT_REQUEST', 'CANCELLATION_REQUEST'))
);

CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_created_at ON support_tickets(created_at DESC);
