-- Globalization Phase A (chunk 6): each event now carries its own country
-- + timezone, populated from the city the organizer picks via
-- GET /geo/cities (chunk 2) - see CityController. Nullable because
-- existing events predate this and have no sensible value to backfill;
-- CreateEventRequest/UpdateEventRequest require both going forward (see
-- their @NotBlank), so this only stays null for events created before
-- this migration.
ALTER TABLE events ADD COLUMN country_code VARCHAR(2);
ALTER TABLE events ADD COLUMN timezone VARCHAR(50);
