const { validateGenerateRequest } = require("../validators/destinations.validator");
const { generateDestinations } = require("../services/destinations.service");

async function generate(req, res, next) {
  try {
    const parsed = validateGenerateRequest(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        message: "Validation failed",
        errors: parsed.error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }

    const data = await generateDestinations(parsed.data);

    res.status(200).json({
      ok: true,
      message: "Destination generate route is wired",
      data,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { generate };
