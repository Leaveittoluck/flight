const { validateGenerateRequest } = require("../validators/destinations.validator");
const { generateDestinations } = require("../services/destinations.service");
const { saveDiscovery } = require("../repositories/discoveries.repository");
const { getRemainingGenerations, recordGeneration } = require("../services/generationQuota.service");

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

    const { anonymous_id } = parsed.data;

    // Generation quota is checked up front. A request that doesn't find a
    // destination must not consume an allowance, so the count is only
    // persisted below, after a destination is actually returned.
    const remainingBefore = await getRemainingGenerations(anonymous_id);
    if (remainingBefore <= 0) {
      return res.status(429).json({
        ok: false,
        code: "GENERATION_LIMIT_REACHED",
        message: "You've reached your monthly destination limit. Upgrade to continue.",
      });
    }

    const data = await generateDestinations(parsed.data);

    let remaining_generations = remainingBefore;

    if (data.destinations.length > 0) {
      const dest = data.destinations[0];

      await recordGeneration({
        anonymous_id,
        user_id: req.user?.id ?? null,
        destination_id: dest.destination_id,
      });
      remaining_generations = remainingBefore - 1;

      // Save a discovery record for authenticated users when a destination was found.
      // Fire-and-forget: a save failure must never affect the generation response.
      if (req.user) {
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
    }

    data.meta.remaining_generations = remaining_generations;

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
