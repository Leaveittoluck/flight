-- =============================================================================
-- LITL — Production Full Migration
-- Safe to run on ANY state of the database:
--   • Fresh Render PostgreSQL (creates everything from scratch)
--   • Partially-migrated DB (skips existing tables, adds missing ones)
-- All statements are idempotent — safe to run more than once.
-- =============================================================================


-- =============================================================================
-- STEP 1 — Schema
-- =============================================================================

CREATE SCHEMA IF NOT EXISTS flight;


-- =============================================================================
-- STEP 2 — Base lookup tables
-- (No-ops if they already exist in your production database)
-- =============================================================================

-- Departure airports (only id=1 / Stansted is used by the app)
CREATE TABLE IF NOT EXISTS flight.departure_airports (
  id        SERIAL       PRIMARY KEY,
  name      VARCHAR(255) NOT NULL,
  iata_code VARCHAR(3)   NULL
);

-- Seed Stansted if missing
INSERT INTO flight.departure_airports (id, name, iata_code)
VALUES (1, 'London Stansted', 'STN')
ON CONFLICT (id) DO NOTHING;

-- Advance the sequence so future INSERTs don't collide with the manually-seeded row
SELECT setval(
  pg_get_serial_sequence('flight.departure_airports', 'id'),
  GREATEST((SELECT MAX(id) FROM flight.departure_airports), 1)
);

-- Trip type lookup (beach, city_break, adventure, cultural, skiing, relaxation)
CREATE TABLE IF NOT EXISTS flight.trip_types (
  id        SERIAL       PRIMARY KEY,
  slug      VARCHAR(100) NOT NULL UNIQUE,
  label     VARCHAR(255) NOT NULL,
  is_active BOOLEAN      NOT NULL DEFAULT true
);

-- Trip type similarity scores (used for fallback destination matching)
CREATE TABLE IF NOT EXISTS flight.trip_type_similarity (
  trip_type_id     INTEGER NOT NULL REFERENCES flight.trip_types(id) ON DELETE CASCADE,
  similar_to_id    INTEGER NOT NULL REFERENCES flight.trip_types(id) ON DELETE CASCADE,
  similarity_score INTEGER NOT NULL,
  PRIMARY KEY (trip_type_id, similar_to_id)
);

-- Destinations
CREATE TABLE IF NOT EXISTS flight.destinations (
  id                         SERIAL        PRIMARY KEY,
  city                       VARCHAR(255)  NOT NULL,
  country                    VARCHAR(255)  NOT NULL,
  iata_code                  VARCHAR(3)    NULL,
  departure_airport_id       INTEGER       NOT NULL REFERENCES flight.departure_airports(id),
  hook                       TEXT,
  fun_fact                   TEXT,
  weather_summary            TEXT,
  flight_cost_per_person_gbp NUMERIC(10,2),
  hotel_cost_per_night_gbp   NUMERIC(10,2),
  default_duration_nights    SMALLINT,
  skyscanner_url             TEXT,
  booking_com_url            TEXT,
  is_active                  BOOLEAN       NOT NULL DEFAULT true
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_destinations_city_airport
  ON flight.destinations (city, departure_airport_id);

-- Destination ↔ trip type join table
CREATE TABLE IF NOT EXISTS flight.destination_trip_types (
  destination_id INTEGER NOT NULL REFERENCES flight.destinations(id) ON DELETE CASCADE,
  trip_type_id   INTEGER NOT NULL REFERENCES flight.trip_types(id)   ON DELETE CASCADE,
  is_primary     BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY (destination_id, trip_type_id)
);

-- Recommended places per destination (up to 3 per card)
CREATE TABLE IF NOT EXISTS flight.recommended_places (
  id             SERIAL       PRIMARY KEY,
  destination_id INTEGER      NOT NULL REFERENCES flight.destinations(id) ON DELETE CASCADE,
  name           VARCHAR(255) NOT NULL,
  description    TEXT,
  sort_order     SMALLINT     NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_recommended_places_destination
  ON flight.recommended_places (destination_id, sort_order);


-- =============================================================================
-- STEP 3 — Affiliate click tracking (migration 000 consolidated)
-- (No-op if flight.clicks already exists)
-- =============================================================================

CREATE TABLE IF NOT EXISTS flight.clicks (
  id             SERIAL      PRIMARY KEY,
  user_id        UUID        NULL,
  anonymous_id   UUID        NULL,
  destination_id INTEGER     NOT NULL,
  click_type     VARCHAR(10) NOT NULL CHECK (click_type IN ('flight', 'hotel')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clicks_anon_created
  ON flight.clicks (anonymous_id, created_at);

CREATE INDEX IF NOT EXISTS idx_clicks_user_created
  ON flight.clicks (user_id, created_at);

-- Add anonymous_id if this DB only had migration 001 (not 002)
ALTER TABLE flight.clicks
  ADD COLUMN IF NOT EXISTS anonymous_id UUID NULL;


-- =============================================================================
-- STEP 4 — ALTER migrations for existing tables
-- (Migration 003: iata_code column; Migration 004: nullable provider URLs)
-- (No-ops if already applied)
-- =============================================================================

ALTER TABLE flight.destinations
  ADD COLUMN IF NOT EXISTS iata_code VARCHAR(3) NULL;

ALTER TABLE flight.destinations
  ALTER COLUMN skyscanner_url  DROP NOT NULL;

ALTER TABLE flight.destinations
  ALTER COLUMN booking_com_url DROP NOT NULL;


-- =============================================================================
-- STEP 5 — Auth: users table (migration 005 + migration 006 terms columns)
-- THIS IS THE PRIMARY FIX FOR THE PRODUCTION ERROR
-- =============================================================================

CREATE TABLE IF NOT EXISTS flight.users (
  id                SERIAL       PRIMARY KEY,
  google_id         VARCHAR(255) NOT NULL UNIQUE,
  email             VARCHAR(255) NOT NULL UNIQUE,
  display_name      VARCHAR(255) NOT NULL,
  avatar_url        TEXT,
  role              VARCHAR(50)  NOT NULL DEFAULT 'user',
  plan              VARCHAR(50)  NOT NULL DEFAULT 'free',
  terms_accepted_at TIMESTAMPTZ,
  terms_version     VARCHAR(20),
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_google_id ON flight.users (google_id);
CREATE INDEX IF NOT EXISTS idx_users_email     ON flight.users (email);

-- Migration 006: add terms columns if this DB had 005 without them
ALTER TABLE flight.users
  ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ;

ALTER TABLE flight.users
  ADD COLUMN IF NOT EXISTS terms_version VARCHAR(20);

-- FK from clicks.user_id → users.id (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_clicks_user_id'
  ) THEN
    ALTER TABLE flight.clicks
      ADD CONSTRAINT fk_clicks_user_id
      FOREIGN KEY (user_id) REFERENCES flight.users(id) ON DELETE SET NULL;
  END IF;
END;
$$;


-- =============================================================================
-- STEP 6 — Plan-based click quota table (migration 007)
-- =============================================================================

CREATE TABLE IF NOT EXISTS flight.user_clicks (
  id             SERIAL      PRIMARY KEY,
  user_id        UUID        NOT NULL REFERENCES flight.users(id) ON DELETE CASCADE,
  destination_id INTEGER     NOT NULL,
  clicked_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_clicks_user_month
  ON flight.user_clicks (user_id, clicked_at);


-- =============================================================================
-- STEP 7 — Discovery history (migration 008)
-- =============================================================================

CREATE TABLE IF NOT EXISTS flight.user_discoveries (
  id                        SERIAL       PRIMARY KEY,
  user_id                   INTEGER      NOT NULL REFERENCES flight.users(id)        ON DELETE CASCADE,
  destination_id            INTEGER      NOT NULL REFERENCES flight.destinations(id) ON DELETE CASCADE,
  generated_at              TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  budget_per_person         NUMERIC(10,2),
  travellers                SMALLINT,
  trip_type                 VARCHAR(100),
  season                    VARCHAR(50),
  estimated_cost_per_person NUMERIC(10,2),
  estimated_total_cost      NUMERIC(10,2)
);

CREATE INDEX IF NOT EXISTS idx_user_discoveries_user_generated
  ON flight.user_discoveries (user_id, generated_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_discoveries_destination
  ON flight.user_discoveries (destination_id);


-- =============================================================================
-- VERIFICATION
-- Run these after migration to confirm everything was created.
-- =============================================================================

-- List all tables in the flight schema (expect 9 tables)
SELECT tablename
FROM pg_tables
WHERE schemaname = 'flight'
ORDER BY tablename;

-- Confirm users table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'flight' AND table_name = 'users'
ORDER BY ordinal_position;
