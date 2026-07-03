-- Adds a CHECK constraint to flight.users.plan so invalid values cannot be stored.
-- Covers the four recognised plan strings including legacy DB values.
-- Idempotent — safe to run on an existing database.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
     WHERE conname = 'chk_users_plan'
       AND conrelid = 'flight.users'::regclass
  ) THEN
    ALTER TABLE flight.users
      ADD CONSTRAINT chk_users_plan
      CHECK (plan IN ('free', 'explorer', 'pro', 'adventurer'));
  END IF;
END;
$$;
