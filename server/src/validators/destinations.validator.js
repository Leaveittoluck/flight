const { z } = require("zod");

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD");

const generateSchema = z
  .object({
    departure_airport_id: z.int().positive(),
    budget: z.number().positive(),
    budget_per_person: z.number().positive().optional(),
    travellers: z.int().min(1).max(6),
    trip_type_slug: z.string().min(1),
    season: z.string().optional(),
    departure_date: isoDate,
    return_date: isoDate.optional(),
  })
  .refine(
    (d) => !d.return_date || d.return_date > d.departure_date,
    { message: "return_date must be after departure_date", path: ["return_date"] }
  );

function validateGenerateRequest(body) {
  return generateSchema.safeParse(body);
}

module.exports = { validateGenerateRequest };
