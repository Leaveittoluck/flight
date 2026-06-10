const { getUserDiscoveries } = require('../repositories/discoveries.repository');

async function getDiscoveries(req, res, next) {
  try {
    const discoveries = await getUserDiscoveries(req.user.id);
    return res.json({ ok: true, data: discoveries });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getDiscoveries };
