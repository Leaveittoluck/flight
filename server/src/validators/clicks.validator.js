const { z } = require("zod");

const clickSchema = z.object({
  destination_id: z.int().positive(),
  click_type: z.enum(["flight", "hotel"]),
  anonymous_id: z.string().uuid(),
});

function validateClickRequest(body) {
  return clickSchema.safeParse(body);
}

module.exports = { validateClickRequest };
