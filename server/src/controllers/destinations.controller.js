const { validateGenerateRequest } = require("../validators/destinations.validator");
const { generateDestinations } = require("../services/destinations.service");
const { saveDiscovery } = require("../repositories/discoveries.repository");

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

    // Save a discovery record for authenticated users when a destination was found.
    // Fire-and-forget: a save failure must never affect the generation response.
    if (req.user && data.destinations.length > 0) {
      const dest = data.destinations[0];
      const totalCost = dest.total_trip_cost_estimate ?? null;
      const perPerson = totalCost != null
        ? Math.ceil(totalCost / parsed.data.travellers)
        : null;

      saveDiscovery({
        user_id:                   req.user.id,
        destination_id:            dest.destination_id,
        budget_per_person:         parsed.data.budget_per_person ?? null,
        travellers:                parsed.data.travellers,
        trip_type:                 parsed.data.trip_type_slug,
        season:                    parsed.data.season,
        estimated_cost_per_person: perPerson,
        estimated_total_cost:      totalCost,
      }).catch((err) => {
        console.error('[discoveries] save failed:', err.message);
      });
    }

    res.status(200).json({
      ok: true,
      message: data.destinations.length
        ? "Destinations found"
        : "No destinations matched your criteria",
      data,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { generate };
