-- Migration 002: Add anonymous_id to flight.clicks
-- Run after 001_create_clicks_table.sql.

ALTER TABLE flight.clicks
  ADD COLUMN IF NOT EXISTS anonymous_id UUID NULL;

-- Index for fast monthly quota lookups scoped to a single anonymous_id
CREATE INDEX IF NOT EXISTS idx_clicks_anon_created
  ON flight.clicks (anonymous_id, created_at);

-- The original idx_clicks_user_created index on (user_id, created_at) is kept.
-- user_id remains in the table for future auth support.
