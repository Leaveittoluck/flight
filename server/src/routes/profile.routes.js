const { Router } = require('express');
const requireAuth = require('../middleware/requireAuth');
const { getProfile, updateProfile } = require('../controllers/profile.controller');

const router = Router();

router.get('/',   requireAuth, getProfile);
router.patch('/', requireAuth, updateProfile);

module.exports = router;
