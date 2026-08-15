-- organizer_id lets this service answer "how much has organizer X earned"
-- without joining event-service on every request - same snapshot-at-booking-time
-- principle as event_title/ticket_type_name/unit_price. Nullable: existing rows
-- (if any, from pre-launch testing) predate this column and won't be backfilled;
-- every booking created from here on populates it via BookingService.
ALTER TABLE bookings ADD COLUMN organizer_id UUID;

CREATE INDEX idx_bookings_organizer_id ON bookings(organizer_id);
