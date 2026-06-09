const { z } = require('zod');

const patchProfileSchema = z.object({
  display_name: z.string().trim().min(1, 'Name cannot be empty').max(100, 'Name must be 100 characters or fewer'),
});

function validatePatchProfile(body) {
  return patchProfileSchema.safeParse(body);
}

module.exports = { validatePatchProfile };
