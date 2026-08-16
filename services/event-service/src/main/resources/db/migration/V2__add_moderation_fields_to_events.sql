ALTER TABLE events ADD COLUMN moderation_reason VARCHAR(500);
ALTER TABLE events ADD COLUMN moderated_by UUID;
ALTER TABLE events ADD COLUMN moderated_at TIMESTAMPTZ;

-- V1's chk_events_status only allowed the organizer-lifecycle statuses -
-- widen it to include the two admin-moderation statuses (FLAGGED, REMOVED).
ALTER TABLE events DROP CONSTRAINT chk_events_status;
ALTER TABLE events ADD CONSTRAINT chk_events_status
    CHECK (status IN ('DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED', 'FLAGGED', 'REMOVED'));
