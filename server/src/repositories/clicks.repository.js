const pool = require('../db/pool');

async function insertClick({ user_id, anonymous_id, destination_id, click_type }) {
  await pool.query(
    `INSERT INTO flight.clicks (user_id, anonymous_id, destination_id, click_type)
     VALUES ($1, $2, $3, $4)`,
    [user_id ?? null, anonymous_id ?? null, destination_id, click_type]
  );
}

// Guests have no separate quota table — flight.clicks doubles as their quota
// source, scoped to rows with no user_id so a later sign-in doesn't inherit
// pre-login click history against the authenticated quota.
async function countGuestClicksThisMonth(anonymous_id) {
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM flight.clicks
     WHERE anonymous_id = $1
       AND user_id IS NULL
       AND created_at >= date_trunc('month', NOW())`,
    [anonymous_id]
  );
  return rows[0].total;
}

module.exports = { insertClick, countGuestClicksThisMonth };
