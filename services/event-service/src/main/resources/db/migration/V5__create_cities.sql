-- Globalization Phase A (chunk 2): city/country reference data backing the
-- autocomplete used by search and (in a later chunk) the organizer
-- event-creation city picker. Static, seeded once by V6, never written to
-- by the application - see City entity's javadoc.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    country_code VARCHAR(2) NOT NULL,
    country_name VARCHAR(100) NOT NULL,
    admin_name VARCHAR(100),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    timezone VARCHAR(50) NOT NULL,
    population INTEGER
);

-- Trigram GIN indexes back both the ILIKE prefix match and the similarity()
-- fuzzy fallback in CityRepository.search - one on name, one on country_name
-- so a query like "ind" surfaces Indian cities via country match too.
CREATE INDEX idx_cities_name_trgm ON cities USING GIN (name gin_trgm_ops);
CREATE INDEX idx_cities_country_name_trgm ON cities USING GIN (country_name gin_trgm_ops);
