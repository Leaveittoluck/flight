function requireAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ ok: false, message: 'Authentication required' });
}

module.exports = requireAuth;
