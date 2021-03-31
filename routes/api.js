const express = require('express')
const router = express.Router()
const resultController = require('../controller/resultController')

router.get('/addsilver/:mob/:exp/:slv', resultController.addSilver)
router.get('/addgold/:mob/:pdp/:acp', resultController.apiaddgold)

module.exports = router;
