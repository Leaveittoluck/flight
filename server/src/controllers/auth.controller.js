function me(req, res) {
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
