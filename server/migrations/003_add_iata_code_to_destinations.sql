-- Migration 003: Add IATA airport code to flight.destinations
-- Enables dynamic Skyscanner deep-link construction without relying on
-- static skyscanner_url values from the database.
-- Run after 001 and 002.

ALTER TABLE flight.destinations
  ADD COLUMN IF NOT EXISTS iata_code VARCHAR(3) NULL;

-- After running this migration, populate iata_code for your destinations.
-- Use the primary airport IATA code for each city. Examples:
--
--   UPDATE flight.destinations SET iata_code = 'BCN' WHERE city = 'Barcelona';
--   UPDATE flight.destinations SET iata_code = 'AMS' WHERE city = 'Amsterdam';
--   UPDATE flight.destinations SET iata_code = 'CDG' WHERE city = 'Paris';
--   UPDATE flight.destinations SET iata_code = 'FCO' WHERE city = 'Rome';
--   UPDATE flight.destinations SET iata_code = 'LIS' WHERE city = 'Lisbon';
--   UPDATE flight.destinations SET iata_code = 'MAD' WHERE city = 'Madrid';
--   UPDATE flight.destinations SET iata_code = 'PRG' WHERE city = 'Prague';
--   UPDATE flight.destinations SET iata_code = 'BUD' WHERE city = 'Budapest';
--   UPDATE flight.destinations SET iata_code = 'KRK' WHERE city = 'Krakow';
--   UPDATE flight.destinations SET iata_code = 'DBV' WHERE city = 'Dubrovnik';
--   UPDATE flight.destinations SET iata_code = 'ATH' WHERE city = 'Athens';
--   UPDATE flight.destinations SET iata_code = 'DUB' WHERE city = 'Dublin';
--
-- Verify after update:
--   SELECT id, city, country, iata_code FROM flight.destinations ORDER BY city;
--
-- Rows with iata_code = NULL will fall back to the static skyscanner_url
-- stored in the database, so partial population is safe.
