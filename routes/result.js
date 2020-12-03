const express = require('express')
const router = express.Router()
const resultController = require('../controller/resultController')

//router.get('/', resultController.index)
//router.post('/Update', function(req, res, next){
   
//})
router.post('/add', resultController.add)
/*router.post('/select', function(req, res, next){
    
})*/
router.get('/done', resultController.result)


module.exports = router;
