const { ROLES } = require('../constants/auth');

/**
 * requireRole(role | role[])
 *
 * Usage:
 *   router.get('/admin/thing', requireAuth, requireRole(ROLES.ADMIN), handler)
 *
 * Returns 401 if the request has no authenticated user.
 * Returns 403 if the user's role is not in the allowed set.
 */
function requireRole(allowed) {
  const allowedRoles = Array.isArray(allowed) ? allowed : [allowed];

  return function (req, res, next) {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ ok: false, message: 'Authentication required' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ ok: false, message: 'Insufficient role' });
    }
    return next();
  };
}

module.exports = requireRole;
