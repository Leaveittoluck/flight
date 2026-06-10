const { Router } = require('express');
const requireAuth = require('../middleware/requireAuth');
const { getUsage } = require('../controllers/usage.controller');

const router = Router();

router.get('/', requireAuth, getUsage);

module.exports = router;
