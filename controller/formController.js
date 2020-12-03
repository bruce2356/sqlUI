const pool = require('../sql/config')
const moment = require('moment')
var fs = require('fs')
const promisify = require('util').promisify
const appendContent = promisify(fs.appendFile)
const dateNowLong = () => moment(new Date()).format('YYYY-MM-DD HH:mm:ss')

exports.index = (req, res, next) => {
          res.render('form/index', {
            title: '表單查詢'
          });
}
exports.query = (req, res, next) => {
function isPhoneAvailable($phoneInput) {
  var myreg=/^[0][9][0-9]{8}$/;
  if (!myreg.test($phoneInput)) {
      return false;
  } else {
      return $phoneInput;
  }
}
  const mob = isPhoneAvailable(req.body.mob)
  let info = 0
  if(mob!==false)
  pool.connect().then(() => {
    appendContent('loggg.txt', `${dateNowLong()}--- select * from Member where Mobile = ${mob}\n`)
    //simple query
    pool.request().query('select * from Member where Mobile = '+ mob, (err, result) => {
      info = result.recordset[0]
      req.flash('mob',mob )
      req.flash('info', info)
      res.redirect('result')
    }) 
  })
  else res.render('form/index', {
    title: '表單查詢'
  })
}

exports.result = (req, res, next) => {
  const result = req.flash('info')[0]
  req.flash('id',result.ID)
  res.render('form/result', {
    mobile: result.Mobile,
    exp: result.Exp,
    gp: result.GoldPoint,
    sp: result.SilverPoint,
    title: '表單查詢結果'
  })
}