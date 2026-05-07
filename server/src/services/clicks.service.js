const pool = require("../db/pool");

const MONTHLY_CLICK_LIMIT = 5;

async function trackClick({ destination_id, click_type }) {
  // No auth yet — user_id is NULL and all anonymous clicks share the same quota.
  // Once auth is in place, replace `null` with the real user ID and the COUNT
  // query will automatically scope to that user only (IS NOT DISTINCT FROM handles
  // the NULL = NULL comparison that standard = does not).
  const userId = null;

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM flight.clicks
     WHERE user_id IS NOT DISTINCT FROM $1
       AND created_at >= date_trunc('month', NOW())`,
    [userId]
  );

  const usedThisMonth = countResult.rows[0].total;

  if (usedThisMonth >= MONTHLY_CLICK_LIMIT) {
    const err = new Error("Monthly click limit reached. Upgrade to continue.");
    err.status = 429;
    err.code = "LIMIT_REACHED";
    throw err;
  }

  await pool.query(
    `INSERT INTO flight.clicks (user_id, destination_id, click_type)
     VALUES ($1, $2, $3)`,
    [userId, destination_id, click_type]
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
