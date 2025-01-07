const express = require('express')
const router = express.Router()
const {RunController, StatusController} = require('../Controller/controller')

router.post('/run', RunController)
router.get('/status', StatusController)

module.exports = router