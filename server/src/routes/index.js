const { Router } = require("express");
const healthRouter = require("./health.routes");
const destinationsRouter = require("./destinations.routes");
const clicksRouter = require("./clicks.routes");

const router = Router();

router.use(healthRouter);
router.use("/destinations", destinationsRouter);
router.use(clicksRouter);

module.exports = router;
