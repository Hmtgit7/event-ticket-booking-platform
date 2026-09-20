-- Globalization follow-up: bookings snapshot the event's timezone at
-- booking time, same rationale as event_title/venue_name/city (V1/V7) -
-- an organizer editing the event later must never rewrite what a past
-- booking says. Nullable for the same reason those are: rows created
-- before this column, and bookings for events that predate event-service's
-- own V7 migration (Event.timezone), have nothing to backfill from.
ALTER TABLE bookings ADD COLUMN event_timezone VARCHAR(50);
