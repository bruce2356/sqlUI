const express = require('express')
const router = express.Router()
const formController = require('../controller/formController')

router.get('/', formController.index)
router.post('/query', formController.query)
router.get('/select', function(req, res, next){
    var mob = req.body.mob;
    req.flash('info',db.select('member4test',mob ));
})
router.get('/result', formController.result)


module.exports = router;
