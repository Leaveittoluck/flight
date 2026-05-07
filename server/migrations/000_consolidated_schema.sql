-- Consolidated schema for flight.clicks
-- Idempotent — safe to run against an existing database.
-- Replaces running 001 + 002 separately; use this for fresh setups.
-- Requires the `flight` schema to already exist.

CREATE TABLE IF NOT EXISTS flight.clicks (
    id             SERIAL       PRIMARY KEY,
    user_id        INTEGER      NULL,              -- reserved for future auth
    anonymous_id   UUID         NULL,              -- per-browser quota identity
    destination_id INTEGER      NOT NULL,
    click_type     VARCHAR(10)  NOT NULL CHECK (click_type IN ('flight', 'hotel')),
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Index for per-browser monthly quota count (current query path)
CREATE INDEX IF NOT EXISTS idx_clicks_anon_created
    ON flight.clicks (anonymous_id, created_at);

-- Index for future per-user quota count (kept for auth migration)
CREATE INDEX IF NOT EXISTS idx_clicks_user_created
    ON flight.clicks (user_id, created_at);
