-- Server-side "which mode is this dual-role account currently using" preference.
-- Null = never explicitly chosen yet (fresh account, or single-role account -
-- role-based defaults handle that case in application logic, not here).
-- Deliberately a free-text column, not a DB enum - matches events.category's
-- reasoning: only two values today ('organizer' / 'user'), validated in the
-- service layer, no migration needed if that ever needs to change.
ALTER TABLE users ADD COLUMN active_persona VARCHAR(20);
