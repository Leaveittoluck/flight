// Passport's session middleware already populates req.user when a valid session
// exists. This middleware normalises the absence to null so route handlers can
// safely do `if (req.user)` without guarding against undefined.
function optionalAuth(req, res, next) {
  if (!req.user) req.user = null;
  return next();
}

module.exports = optionalAuth;
