const { Router } = require("express");
const healthRouter = require("./health.routes");
const destinationsRouter = require("./destinations.routes");

const router = Router();

router.use(healthRouter);
router.use("/destinations", destinationsRouter);

module.exports = router;
