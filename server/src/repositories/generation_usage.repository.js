const pool = require('../db/pool');

async function countGenerationsThisMonth(anonymous_id) {
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM flight.generation_usage
     WHERE anonymous_id = $1
       AND created_at >= date_trunc('month', NOW())`,
    [anonymous_id]
  );
  return rows[0].total;
}

// Account-bound count for authenticated users.
// Uses the idx_generation_usage_user_month index already created in migration 009.
async function countGenerationsThisMonthByUser(user_id) {
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM flight.generation_usage
     WHERE user_id = $1
       AND created_at >= date_trunc('month', NOW())`,
    [user_id]
  );
  return rows[0].total;
}

async function insertGenerationUsage({ anonymous_id, user_id, destination_id }) {
  await pool.query(
    `INSERT INTO flight.generation_usage (anonymous_id, user_id, destination_id)
     VALUES ($1, $2, $3)`,
    [anonymous_id, user_id ?? null, destination_id ?? null]
  );
}

module.exports = { countGenerationsThisMonth, countGenerationsThisMonthByUser, insertGenerationUsage };
