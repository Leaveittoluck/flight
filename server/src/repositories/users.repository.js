const pool = require('../db/pool');

async function upsertGoogleUser({ google_id, email, display_name, avatar_url }) {
  const { rows } = await pool.query(
    `INSERT INTO flight.users (google_id, email, display_name, avatar_url, updated_at)
     VALUES ($1, $2, $3, $4, NOW())
     ON CONFLICT (google_id) DO UPDATE SET
       email        = EXCLUDED.email,
       display_name = EXCLUDED.display_name,
       avatar_url   = EXCLUDED.avatar_url,
       updated_at   = NOW()
     RETURNING *`,
    [google_id, email, display_name, avatar_url]
  );
  return rows[0];
}

async function findById(id) {
  const { rows } = await pool.query(
    'SELECT * FROM flight.users WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

async function updatePlan(id, plan) {
  const { rows } = await pool.query(
    `UPDATE flight.users
     SET plan = $2, updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, plan]
  );
  return rows[0] || null;
}

module.exports = { upsertGoogleUser, findById, updatePlan };
