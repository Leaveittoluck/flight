const { validateClickRequest } = require("../validators/clicks.validator");
const { trackClick } = require("../services/clicks.service");

async function track(req, res, next) {
  try {
    const parsed = validateClickRequest(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        message: "Invalid click payload",
        errors: parsed.error.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }

    const data = await trackClick({
      ...parsed.data,
      user: req.user || null,
    });

    if (!data.allowed) {
      return res.status(429).json({
        ok: false,
        code: "CLICK_LIMIT_REACHED",
        message: "You've reached your monthly click limit. Upgrade to continue.",
        data,
      });
    }

    res.status(200).json({
      ok: true,
      message: "Click tracked",
      data,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { track };
