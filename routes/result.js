const express = require('express')
const router = express.Router()
var db = require('../sql/db.js');
const resultController = require('../controller/resultController')

router.get('/', resultController.index)
router.post('/Update', function(req, res, next){
    var content = {
        Exp : req.body.addExp,
        SilverPoint : req.body.addSlv,
        GoldPoint : req.body.addGld
    }
    db.update(content, {Mobile: req.flash('sqlstuff')[0]}, "Member4test", (err, result) => {
        res.redirect('back')
    })
})
router.post('/add', resultController.add)
/*router.post('/select', function(req, res, next){
    
})*/
router.get('/done', resultController.result)


module.exports = router;