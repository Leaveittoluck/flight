const { GENERATION_LIMITS } = require('../constants/auth');
const {
  countGenerationsThisMonth,
  insertGenerationUsage,
} = require('../repositories/generation_usage.repository');

// Anonymous users always get the Free tier limit for now (see GENERATION_LIMITS).
const FREE_LIMIT = GENERATION_LIMITS.free;

async function getRemainingGenerations(anonymous_id) {
  const used = await countGenerationsThisMonth(anonymous_id);
  return Math.max(0, FREE_LIMIT - used);
}

async function recordGeneration({ anonymous_id, user_id, destination_id }) {
  await insertGenerationUsage({ anonymous_id, user_id, destination_id });
}

module.exports = { getRemainingGenerations, recordGeneration, FREE_LIMIT };
