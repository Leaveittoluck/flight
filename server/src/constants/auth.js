const ROLES = Object.freeze({
  USER:  'user',
  ADMIN: 'admin',
});

const PLANS = Object.freeze({
  FREE:       'free',
  PRO:        'pro',
  ADVENTURER: 'adventurer',
});

// Ordered lowest → highest for plan-hierarchy checks
const PLAN_ORDER = [PLANS.FREE, PLANS.PRO, PLANS.ADVENTURER];

module.exports = { ROLES, PLANS, PLAN_ORDER };
