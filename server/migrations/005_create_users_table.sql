-- Creates flight.users for Google OAuth authentication.
-- Adds FK from flight.clicks.user_id → flight.users.id.
-- Idempotent — safe to run on an existing database.

CREATE TABLE IF NOT EXISTS flight.users (
    id                SERIAL        PRIMARY KEY,
    google_id         VARCHAR(255)  NOT NULL UNIQUE,
    email             VARCHAR(255)  NOT NULL UNIQUE,
    display_name      VARCHAR(255)  NOT NULL,
    avatar_url        TEXT,
    role              VARCHAR(50)   NOT NULL DEFAULT 'user',
    plan              VARCHAR(50)   NOT NULL DEFAULT 'free',
    terms_accepted_at TIMESTAMPTZ,
    terms_version     VARCHAR(20),
    created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_google_id ON flight.users (google_id);
CREATE INDEX IF NOT EXISTS idx_users_email     ON flight.users (email);

-- Add FK from clicks.user_id to users.id (skipped if already exists).
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
