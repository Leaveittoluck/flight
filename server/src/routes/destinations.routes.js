const { Router } = require("express");
const { generate } = require("../controllers/destinations.controller");

const router = Router();

router.post("/generate", generate);

module.exports = router;
