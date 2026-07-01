const { PLAN_ORDER } = require('../constants/auth');

/**
 * requirePlan(minimumPlan)
 *
 * Enforces a minimum plan tier.
 * Plan hierarchy: free < explorer < pro < adventurer (pro/adventurer are legacy).
 * A user on 'pro' or 'adventurer' satisfies requirePlan('explorer').
 *
 * Usage:
 *   router.get('/feature', requireAuth, requirePlan('explorer'), handler)
 *
 * Returns 401 if the request has no authenticated user.
 * Returns 403 if the user's plan is below the required tier.
 */
function requirePlan(minimumPlan) {
  const minIndex = PLAN_ORDER.indexOf(minimumPlan);
  if (minIndex === -1) {
    throw new Error(`requirePlan: unknown plan "${minimumPlan}"`);
  }

  return function (req, res, next) {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ ok: false, message: 'Authentication required' });
    }
    const userIndex = PLAN_ORDER.indexOf(req.user.plan);
    if (userIndex < minIndex) {
      return res.status(403).json({ ok: false, message: 'Plan upgrade required' });
    }
    return next();
  };
}

module.exports = requirePlan;
