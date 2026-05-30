const { Router } = require('express')
const { getDestinationImage } = require('../controllers/images.controller')

const router = Router()

router.get('/destination', getDestinationImage)

module.exports = router
