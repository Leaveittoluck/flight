-- Migration 004: Make provider URL columns nullable
-- skyscanner_url and booking_com_url are now generated dynamically from
-- iata_code, city, and user input (dates + travellers). Static URLs are
-- optional fallbacks only — destinations seeded without them will still
-- produce valid affiliate links.

ALTER TABLE flight.destinations ALTER COLUMN skyscanner_url DROP NOT NULL;
ALTER TABLE flight.destinations ALTER COLUMN booking_com_url DROP NOT NULL;
