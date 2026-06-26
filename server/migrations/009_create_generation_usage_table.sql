-- Creates flight.generation_usage for destination-generation quota tracking.
-- Replaces the old CTA-click-based quota model: the limit now applies to
-- POST /api/destinations/generate, not to flight/hotel affiliate clicks.
-- Tracked by anonymous_id today; user_id is nullable and reserved for when
-- generation quota moves to full account-based plans.
-- Idempotent — safe to run on existing databases.

CREATE TABLE IF NOT EXISTS flight.generation_usage (
    id             SERIAL       PRIMARY KEY,
    anonymous_id   UUID         NOT NULL,
    user_id        INTEGER      REFERENCES flight.users(id) ON DELETE SET NULL,
    destination_id INTEGER      REFERENCES flight.destinations(id) ON DELETE SET NULL,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Supports monthly count query:
--   WHERE anonymous_id = $1 AND created_at >= date_trunc('month', NOW())
CREATE INDEX IF NOT EXISTS idx_generation_usage_anon_month
    ON flight.generation_usage (anonymous_id, created_at);

-- Reserved for future user_id-based quota lookups.
CREATE INDEX IF NOT EXISTS idx_generation_usage_user_month
    ON flight.generation_usage (user_id, created_at);
