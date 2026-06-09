const { Router } = require('express');
const passport   = require('../config/passport');
const requireAuth = require('../middleware/requireAuth');
const { me, logout } = require('../controllers/auth.controller');

const router = Router();

// Initiates Google OAuth flow
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google redirects here after consent
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_ORIGIN}/login?error=auth_failed`,
  }),
  (_req, res) => {
    res.redirect(`${process.env.CLIENT_ORIGIN}/dashboard`);
  }
);

router.get('/me', requireAuth, me);
router.post('/logout', logout);

module.exports = router;
