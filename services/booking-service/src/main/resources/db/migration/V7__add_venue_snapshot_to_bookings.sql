-- venue_name/address/city are snapshots of the event's venue at booking time,
-- same principle as event_title/ticket_type_name/unit_price - a ticket PDF
-- needs to show where the attendee is going even if the organizer edits the
-- venue later. Nullable: existing rows predate this column and won't be
-- backfilled; every booking created from here on populates it via BookingService.
ALTER TABLE bookings ADD COLUMN venue_name VARCHAR(200);
ALTER TABLE bookings ADD COLUMN address VARCHAR(300);
ALTER TABLE bookings ADD COLUMN city VARCHAR(100);
