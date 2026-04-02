const { z } = require("zod");

const generateSchema = z.object({
  departure_airport_id: z.int().positive(),
  budget: z.number().positive(),
  travellers: z.int().min(1).max(6),
  trip_type_slug: z.string().min(1),
  season: z.string().optional(),
});

function validateGenerateRequest(body) {
  return generateSchema.safeParse(body);
}

module.exports = { validateGenerateRequest };
