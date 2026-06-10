const pool = require('../db/pool');

async function insertUserClick({ user_id, destination_id }) {
  await pool.query(
    `INSERT INTO flight.user_clicks (user_id, destination_id)
     VALUES ($1, $2)`,
    [user_id, destination_id]
  );
}

async function countUserClicksThisMonth(user_id) {
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM flight.user_clicks
     WHERE user_id = $1
       AND clicked_at >= date_trunc('month', NOW())`,
    [user_id]
  );
  return rows[0].total;
}

module.exports = { insertUserClick, countUserClicksThisMonth };
