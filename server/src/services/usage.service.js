const { PLAN_LIMITS } = require('../constants/auth');
const { countUserClicksThisMonth } = require('../repositories/user_clicks.repository');

async function getUserUsage(user) {
  const limit = PLAN_LIMITS[user.plan] ?? null;
  const clicksUsed = await countUserClicksThisMonth(user.id);
  const clicksRemaining = limit === null ? null : Math.max(0, limit - clicksUsed);

  return {
    plan:             user.plan,
    clicksUsed,
    clicksLimit:      limit,
    clicksRemaining,
  };
}

module.exports = { getUserUsage };
