function me(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ ok: false, message: 'Not authenticated' });
  }
  const { id, email, display_name, avatar_url, role, plan } = req.user;
  return res.json({ ok: true, data: { id, email, display_name, avatar_url, role, plan } });
}

function logout(req, res, next) {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((err2) => {
      if (err2) return next(err2);
      res.clearCookie('litl.sid');
      return res.json({ ok: true, message: 'Logged out' });
    });
  });
}

module.exports = { me, logout };
