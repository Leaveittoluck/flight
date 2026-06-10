const pool = require("../db/pool");
const { PLAN_LIMITS } = require("../constants/auth");
const { insertUserClick, countUserClicksThisMonth } = require("../repositories/user_clicks.repository");

async function trackClick({ destination_id, click_type, anonymous_id, user }) {
  const user_id = user?.id ?? null;

  // Always insert into the affiliate analytics table.
  await pool.query(
    `INSERT INTO flight.clicks (user_id, anonymous_id, destination_id, click_type)
     VALUES ($1, $2, $3, $4)`,
    [user_id, anonymous_id || null, destination_id, click_type]
  );

  // Track authenticated clicks in user_clicks for plan-based usage reporting.
  // Guests are not tracked (business rule: unlimited, not tracked).
  let remaining_clicks = null;
  if (user_id && user) {
    await insertUserClick({ user_id, destination_id });

    const limit = PLAN_LIMITS[user.plan] ?? null;
    if (limit !== null) {
      const used = await countUserClicksThisMonth(user_id);
      remaining_clicks = Math.max(0, limit - used);
    }
    // null means unlimited — frontend treats null as no counter to show
  }

  return { destination_id, click_type, remaining_clicks };
}

module.exports = { trackClick };
