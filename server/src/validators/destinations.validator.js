const { z } = require("zod");

const VALID_SEASONS = ["spring", "summer", "autumn", "fall", "winter"];

const generateSchema = z.object({
  departure_airport_id: z.int().positive(),
  budget: z.number().positive(),
  budget_per_person: z.number().positive().optional(),
  anonymous_id: z.string().uuid(),
  travellers: z.int().min(1).max(6),
  trip_type_slug: z.string().min(1),
  season: z
    .string()
    .min(1, "season is required")
    .refine((s) => VALID_SEASONS.includes(s.toLowerCase()), {
      message: `season must be one of: ${VALID_SEASONS.join(", ")}`,
    }),
});

function validateGenerateRequest(body) {
  return generateSchema.safeParse(body);
}

module.exports = { validateGenerateRequest };
