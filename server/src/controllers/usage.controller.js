const { getUserUsage } = require('../services/usage.service');

async function getUsage(req, res, next) {
  try {
    const usage = await getUserUsage(req.user);
    return res.json({ ok: true, data: usage });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getUsage };
