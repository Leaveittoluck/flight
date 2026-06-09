-- Idempotent: adds terms_accepted_at and terms_version to flight.users if missing.
-- Safe to run on databases created before migration 005 included these columns.

ALTER TABLE flight.users
  ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS terms_version     VARCHAR(20);
