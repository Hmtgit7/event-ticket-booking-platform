-- Events owned by an organizer (organizer_id references auth-service's users.id,
-- but there's no FK across services - each service owns its own DB).
CREATE TABLE events (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organizer_id      UUID NOT NULL,
    title             VARCHAR(200) NOT NULL,
    slug              VARCHAR(220) NOT NULL UNIQUE,
    category          VARCHAR(50) NOT NULL,
    description       TEXT NOT NULL,
    venue_name        VARCHAR(200) NOT NULL,
    address           VARCHAR(255) NOT NULL,
    city              VARCHAR(100) NOT NULL,
    latitude          DOUBLE PRECISION,
    longitude         DOUBLE PRECISION,
    start_at          TIMESTAMPTZ NOT NULL,
    end_at            TIMESTAMPTZ NOT NULL,
    banner_image_url  VARCHAR(500),
    banner_public_id  VARCHAR(255),
    status            VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    published_at      TIMESTAMPTZ,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_events_status CHECK (status IN ('DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED')),
    CONSTRAINT chk_events_dates CHECK (end_at > start_at)
);

-- Ticket tiers for an event (General, VIP, etc). One event has 1+ tiers once published.
CREATE TABLE ticket_types (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id           UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name               VARCHAR(100) NOT NULL,
    price              NUMERIC(10, 2) NOT NULL,
    quantity_total     INTEGER NOT NULL,
    quantity_available INTEGER NOT NULL,
    sales_start        TIMESTAMPTZ,
    sales_end          TIMESTAMPTZ,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_ticket_types_price_nonneg CHECK (price >= 0),
    CONSTRAINT chk_ticket_types_qty CHECK (quantity_total >= 0 AND quantity_available >= 0 AND quantity_available <= quantity_total)
);

CREATE INDEX idx_events_organizer_id ON events(organizer_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_city ON events(city);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_start_at ON events(start_at);
CREATE INDEX idx_ticket_types_event_id ON ticket_types(event_id);
