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

// Monthly destination click limits. null = unlimited.
const PLAN_LIMITS = Object.freeze({
  free:       5,
  pro:        50,
  adventurer: null,
});

module.exports = { ROLES, PLANS, PLAN_ORDER, PLAN_LIMITS };
