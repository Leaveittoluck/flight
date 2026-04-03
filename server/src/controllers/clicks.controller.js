const { validateClickRequest } = require("../validators/clicks.validator");
const { trackClick } = require("../services/clicks.service");

async function track(req, res, next) {
  try {
    const parsed = validateClickRequest(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        message: "Invalid click payload",
        errors: parsed.error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }

    const data = await trackClick(parsed.data);

    res.status(200).json({
      ok: true,
      message: "Click tracked",
      data,
    });
  } catch (error) {
    // Service errors (including future LIMIT_REACHED throws) pass through here.
    // The global error handler reads err.status and err.message automatically,
    // so a 429 with code: "LIMIT_REACHED" propagates to the frontend unchanged.
    next(error);
  }
}

module.exports = { track };
