const { PLAN_LIMITS, GUEST_CLICK_LIMIT } = require("../constants/auth");
const { buildUsageSnapshot } = require("../utils/usageSnapshot");
const { insertClick, countGuestClicksThisMonth } = require("../repositories/clicks.repository");
const { insertUserClick, countUserClicksThisMonth } = require("../repositories/user_clicks.repository");

async function trackClick({ destination_id, click_type, anonymous_id, user }) {
  const user_id = user?.id ?? null;

  const plan = user_id ? user.plan : "guest";
  const limit = user_id ? (PLAN_LIMITS[user.plan] ?? null) : GUEST_CLICK_LIMIT;
  const used = user_id
    ? await countUserClicksThisMonth(user_id)
    : await countGuestClicksThisMonth(anonymous_id);

  const allowed = limit === null || used < limit;

  if (!allowed) {
    return { allowed, destination_id, click_type, ...buildUsageSnapshot({ plan, used, limit }) };
  }

  // Insert only on an allowed click — flight.clicks doubles as the guest
  // quota source, so a blocked attempt must never be recorded as a click.
  await insertClick({ user_id, anonymous_id, destination_id, click_type });
  if (user_id) {
    await insertUserClick({ user_id, destination_id });
  }

  return {
    allowed,
    destination_id,
    click_type,
    ...buildUsageSnapshot({ plan, used: used + 1, limit }),
  };
}

module.exports = { trackClick };
