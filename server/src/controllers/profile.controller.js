const { getProfileById, updateDisplayName } = require('../repositories/profile.repository');
const { validatePatchProfile } = require('../validators/profile.validator');

async function getProfile(req, res, next) {
  try {
    const profile = await getProfileById(req.user.id);
    if (!profile) return res.status(404).json({ ok: false, message: 'Profile not found' });
    return res.json({ ok: true, data: profile });
  } catch (err) {
    return next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const result = validatePatchProfile(req.body);
    if (!result.success) {
      return res.status(400).json({
        ok: false,
        message: result.error.issues[0]?.message ?? 'Validation failed',
      });
    }

    const updated = await updateDisplayName(req.user.id, result.data.display_name);
    if (!updated) return res.status(404).json({ ok: false, message: 'Profile not found' });

    return res.json({ ok: true, data: updated });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getProfile, updateProfile };
