const ROLES = Object.freeze({
  USER:  'user',
  ADMIN: 'admin',
});

const PLANS = Object.freeze({
  FREE:       'free',
  EXPLORER:   'explorer',   // current paid tier
  PRO:        'pro',        // legacy — maps to Explorer Membership in the UI
  ADVENTURER: 'adventurer', // legacy — maps to Explorer Membership in the UI
});

// Ordered lowest → highest for plan-hierarchy checks.
// 'explorer' sits between free and the legacy paid tiers so
// requirePlan('explorer') also admits legacy pro/adventurer users.
const PLAN_ORDER = [PLANS.FREE, PLANS.EXPLORER, PLANS.PRO, PLANS.ADVENTURER];

// Monthly affiliate CTA click limits, enforced server-side in clicks.service.js.
// null = unlimited.
const PLAN_LIMITS = Object.freeze({
  free:       5,
  explorer:   null, // unlimited
  pro:        50,   // legacy
  adventurer: null, // legacy
});

// Monthly CTA click limit for unauthenticated guests, tracked by anonymous_id.
// Guests are not a real plan tier, so this lives separately from PLAN_LIMITS.
const GUEST_CLICK_LIMIT = 5;

// Monthly destination *generation* limits. null = unlimited.
// Anonymous users (no account yet) are tracked by anonymous_id and always
// get the Free tier limit for now — plan-aware generation limits are a TODO
// for when full auth/subscriptions land.
const GENERATION_LIMITS = Object.freeze({
  free:       5,
  explorer:   null, // unlimited
  pro:        50,   // legacy
  adventurer: null, // legacy
});

module.exports = { ROLES, PLANS, PLAN_ORDER, PLAN_LIMITS, GUEST_CLICK_LIMIT, GENERATION_LIMITS };
