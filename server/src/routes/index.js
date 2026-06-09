const { Router } = require("express");
const healthRouter       = require("./health.routes");
const destinationsRouter = require("./destinations.routes");
const clicksRouter       = require("./clicks.routes");
const imagesRouter       = require("./images.routes");
const authRouter         = require("./auth.routes");

const router = Router();

router.use("/auth", authRouter);
router.use(healthRouter);
router.use("/destinations", destinationsRouter);
router.use("/images", imagesRouter);
router.use(clicksRouter);

module.exports = router;
