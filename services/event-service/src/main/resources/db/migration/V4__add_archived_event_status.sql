-- Widen chk_events_status (see V2's comment for the same pattern) to add
-- ARCHIVED - self-service cleanup status for never-sold events swept up
-- during organizer profile deletion (see EventStatus's class comment).
ALTER TABLE events DROP CONSTRAINT chk_events_status;
ALTER TABLE events ADD CONSTRAINT chk_events_status
    CHECK (status IN ('DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED', 'FLAGGED', 'REMOVED', 'ARCHIVED'));
