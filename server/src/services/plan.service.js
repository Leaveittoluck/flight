const { PLAN_ORDER } = require('../constants/auth');
const { updatePlan } = require('../repositories/users.repository');

// Changes a user's plan. Validates the plan value against the centralized
// PLAN_ORDER so invalid strings can never reach the database.
// Called by the Stripe webhook handler in Phase 15 — not exposed via API yet.
async function setUserPlan(userId, plan) {
  if (!PLAN_ORDER.includes(plan)) {
    throw new Error(`setUserPlan: unknown plan "${plan}"`);
  }
  return updatePlan(userId, plan);
}

module.exports = { setUserPlan };
