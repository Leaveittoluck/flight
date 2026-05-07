-- Migration 001: Create flight.clicks table
-- Run once against your PostgreSQL database.
-- Requires the `flight` schema to already exist.

CREATE TABLE IF NOT EXISTS flight.clicks (
    id             SERIAL PRIMARY KEY,
    user_id        INTEGER          NULL,        -- NULL until auth is added
    destination_id INTEGER          NOT NULL,
    click_type     VARCHAR(10)      NOT NULL CHECK (click_type IN ('flight', 'hotel')),
    created_at     TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

-- Speeds up the monthly count query scoped by user_id
CREATE INDEX IF NOT EXISTS idx_clicks_user_created
    ON flight.clicks (user_id, created_at);
