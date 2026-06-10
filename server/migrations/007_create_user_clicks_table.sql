-- Creates flight.user_clicks for plan-based usage tracking.
-- Separate from flight.clicks (affiliate analytics / provider link tracking).
-- Idempotent — safe to run on existing databases.

CREATE TABLE IF NOT EXISTS flight.user_clicks (
    id             SERIAL       PRIMARY KEY,
    user_id        INTEGER      NOT NULL REFERENCES flight.users(id) ON DELETE CASCADE,
    destination_id INTEGER      NOT NULL,
    clicked_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Supports monthly count query:
--   WHERE user_id = $1 AND clicked_at >= date_trunc('month', NOW())
CREATE INDEX IF NOT EXISTS idx_user_clicks_user_month
    ON flight.user_clicks (user_id, clicked_at);
