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

// Monthly affiliate click limits (legacy — informational only, not enforced
// against the generator). null = unlimited.
const PLAN_LIMITS = Object.freeze({
  free:       5,
  pro:        50,
  adventurer: null,
});

// Monthly destination *generation* limits. null = unlimited.
// Anonymous users (no account yet) are tracked by anonymous_id and always
// get the Free tier limit for now — plan-aware generation limits are a TODO
// for when full auth/subscriptions land.
const GENERATION_LIMITS = Object.freeze({
  free:       5,
  pro:        50,
  adventurer: null,
});

module.exports = { ROLES, PLANS, PLAN_ORDER, PLAN_LIMITS, GENERATION_LIMITS };
