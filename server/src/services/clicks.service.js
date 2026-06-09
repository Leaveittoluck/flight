const pool = require("../db/pool");

const MONTHLY_CLICK_LIMIT = 5;

async function trackClick({ destination_id, click_type, anonymous_id, user_id }) {
  // Rate-limit by user_id for authenticated users, anonymous_id for guests.
  let countResult;
  if (user_id) {
    countResult = await pool.query(
      `SELECT COUNT(*)::int AS total
       FROM flight.clicks
       WHERE user_id = $1
         AND created_at >= date_trunc('month', NOW())`,
      [user_id]
    );
  } else {
    countResult = await pool.query(
      `SELECT COUNT(*)::int AS total
       FROM flight.clicks
       WHERE anonymous_id = $1
         AND created_at >= date_trunc('month', NOW())`,
      [anonymous_id]
    );
  }

  const usedThisMonth = countResult.rows[0].total;

  if (usedThisMonth >= MONTHLY_CLICK_LIMIT) {
    const err = new Error("Monthly click limit reached. Upgrade to continue.");
    err.status = 429;
    err.code = "LIMIT_REACHED";
    throw err;
  }

  await pool.query(
    `INSERT INTO flight.clicks (user_id, anonymous_id, destination_id, click_type)
     VALUES ($1, $2, $3, $4)`,
    [user_id || null, anonymous_id, destination_id, click_type]
  );

  // NOTE (provider caching): When live flight/hotel provider APIs are added,
  // identical requests (same destination + click_type within a short window)
  // should be served from cache to protect rate-limited API quotas. Add that
  // caching layer here in the service, not in the controller or route.

  return {
    destination_id,
    click_type,
    remaining_clicks: MONTHLY_CLICK_LIMIT - (usedThisMonth + 1),
  };
}

module.exports = { trackClick };
