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

    const data = await trackClick({
      ...parsed.data,
      user_id: req.user?.id || null,
    });

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
