const { GENERATION_LIMITS } = require('../constants/auth');
const {
  countGenerationsThisMonth,
  countGenerationsThisMonthByUser,
  insertGenerationUsage,
} = require('../repositories/generation_usage.repository');

// Returns how many generations the caller has remaining this month.
// Returns null when the plan has no limit (Explorer and above = unlimited).
// Authenticated users are counted by user_id (account-wide, all devices).
// Guests are counted by anonymous_id (device-bound, as before).
async function getRemainingGenerations(anonymous_id, user) {
  const plan  = user?.plan ?? 'free';
  const limit = GENERATION_LIMITS[plan] ?? GENERATION_LIMITS.free;

  if (limit === null) return null; // unlimited plan

  const used = user?.id
    ? await countGenerationsThisMonthByUser(user.id)
    : await countGenerationsThisMonth(anonymous_id);

  return Math.max(0, limit - used);
}

async function recordGeneration({ anonymous_id, user_id, destination_id }) {
  await insertGenerationUsage({ anonymous_id, user_id, destination_id });
}

module.exports = { getRemainingGenerations, recordGeneration };
