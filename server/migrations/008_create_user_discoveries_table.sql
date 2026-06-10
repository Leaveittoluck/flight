-- Creates flight.user_discoveries for personal destination discovery history.
-- Separate from flight.clicks (affiliate analytics) and flight.user_clicks (plan quota).
-- Idempotent — safe to run on existing databases.

CREATE TABLE IF NOT EXISTS flight.user_discoveries (
    id                        SERIAL        PRIMARY KEY,
    user_id                   INTEGER       NOT NULL REFERENCES flight.users(id)       ON DELETE CASCADE,
    destination_id            INTEGER       NOT NULL REFERENCES flight.destinations(id) ON DELETE CASCADE,
    generated_at              TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    budget_per_person         NUMERIC(10,2),
    travellers                SMALLINT,
    trip_type                 VARCHAR(100),
    season                    VARCHAR(50),
    estimated_cost_per_person NUMERIC(10,2),
    estimated_total_cost      NUMERIC(10,2)
);

-- Supports listing a user's discoveries newest-first
CREATE INDEX IF NOT EXISTS idx_user_discoveries_user_generated
    ON flight.user_discoveries (user_id, generated_at DESC);

-- Supports destination-side lookups (future analytics / popularity)
CREATE INDEX IF NOT EXISTS idx_user_discoveries_destination
    ON flight.user_discoveries (destination_id);
