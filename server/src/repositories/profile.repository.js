const pool = require('../db/pool');

async function getProfileById(id) {
  const { rows } = await pool.query(
    `SELECT id, email, display_name, avatar_url, role, plan, created_at
     FROM flight.users
     WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

async function updateDisplayName(id, display_name) {
  const { rows } = await pool.query(
    `UPDATE flight.users
     SET display_name = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING id, email, display_name, avatar_url, role, plan, created_at`,
    [display_name, id]
  );
  return rows[0] || null;
}

module.exports = { getProfileById, updateDisplayName };
