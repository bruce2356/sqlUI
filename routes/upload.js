const express = require('express')
const router = express.Router()
const resultController = require('../controller/resultController')

router.get('/', index=(req, res, next) => {
    res.render('upload',{title: '上傳表單'});
  });
router.post('/', resultController.do_file)
router.get('/ULdone', resultController.done_file)

module.exports = router;