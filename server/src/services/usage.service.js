const { PLAN_LIMITS, GENERATION_LIMITS } = require('../constants/auth');
const { buildUsageSnapshot } = require('../utils/usageSnapshot');
const { countUserClicksThisMonth } = require('../repositories/user_clicks.repository');
const { countGenerationsThisMonthByUser } = require('../repositories/generation_usage.repository');

async function getUserUsage(user) {
  const clickLimit = PLAN_LIMITS[user.plan] ?? null;
  const genLimit   = GENERATION_LIMITS[user.plan] ?? null;

  const [clicksUsed, generationsUsed] = await Promise.all([
    countUserClicksThisMonth(user.id),
    countGenerationsThisMonthByUser(user.id),
  ]);

  const clickSnapshot = buildUsageSnapshot({ plan: user.plan, used: clicksUsed, limit: clickLimit });

  return {
    ...clickSnapshot,
    generationsUsed,
    generationsLimit:     genLimit,
    generationsRemaining: genLimit === null ? null : Math.max(0, genLimit - generationsUsed),
  };
}

module.exports = { getUserUsage };
