const { PLAN_LIMITS } = require('../constants/auth');
const { buildUsageSnapshot } = require('../utils/usageSnapshot');
const { countUserClicksThisMonth } = require('../repositories/user_clicks.repository');

async function getUserUsage(user) {
  const limit = PLAN_LIMITS[user.plan] ?? null;
  const used = await countUserClicksThisMonth(user.id);

  return buildUsageSnapshot({ plan: user.plan, used, limit });
}

module.exports = { getUserUsage };
