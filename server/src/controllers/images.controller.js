const { fetchDestinationImage } = require('../services/images.service')

async function getDestinationImage(req, res, next) {
  try {
    const city    = (req.query.city    || '').trim()
    const country = (req.query.country || '').trim()

    if (!city) {
      return res.status(400).json({ ok: false, message: 'city query parameter is required' })
    }

    const url = await fetchDestinationImage(city, country)

    res.json({ ok: true, data: { url } })
  } catch (err) {
    next(err)
  }
}

module.exports = { getDestinationImage }
