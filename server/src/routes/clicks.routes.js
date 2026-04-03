const { Router } = require("express");
const { track } = require("../controllers/clicks.controller");

const router = Router();

router.post("/click", track);

module.exports = router;
