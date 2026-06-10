const { Router } = require("express");
const optionalAuth = require("../middleware/optionalAuth");
const { generate } = require("../controllers/destinations.controller");

const router = Router();

router.post("/generate", optionalAuth, generate);

module.exports = router;
