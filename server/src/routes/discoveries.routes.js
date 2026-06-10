const { Router } = require('express');
const requireAuth = require('../middleware/requireAuth');
const { getDiscoveries } = require('../controllers/discoveries.controller');

const router = Router();

router.get('/', requireAuth, getDiscoveries);

module.exports = router;
