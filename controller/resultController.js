const pool = require("../sql/config")
const moment = require('moment')
var fs = require('fs')
const promisify = require('util').promisify
const appendContent = promisify(fs.appendFile)
const resultQry = require('../sql/query/resultQry')
// const { setuid } = require("process")
exports.add = (req, res, next) => {

  const { 
    insPointRecord1,
    insPushInbox1,
    updMember1,
    insPointRecord2,
    insPushInbox2,
    updMember2,
  } = resultQry

  const pdp= notNull(req.body.pdp)
  const atp= notNull(req.body.acp)
  const params = {
    mob:  req.flash('mob')[0],
    id: req.flash('id')[0],
    slv: notNull(req.body.addSlv),
    exp: notNull(req.body.addExp),
    pdp: pdp,
    atp: atp,
    prize: whatPrize(pdp,atp),
    dateNowShort: moment(new Date()).format('YYYYMMDD'),
    dateNowLong: dateNowLong(),
    timestamp: moment().unix()
  }
  console.log(params.prize)

  req.flash('mob',params.mob)

  async function execute() {
    try {
      const conn = await pool.connect()
      const request = pool.request()
      if (params.prize !== false) {
        await log(request.query(insPointRecord1(params)), insPointRecord1(params))
        await log(request.query(insPushInbox1(params)), insPushInbox1(params))
        await log(request.query(updMember1(params)), updMember1(params))
      }
      if (params.slv != 0 || params.exp != 0) {
        await log(request.query(insPointRecord2(params)), insPointRecord2(params))
        await log(request.query(insPushInbox2(params)), insPushInbox2(params))
        await log(request.query(updMember2(params)), updMember2(params))
      }
      res.redirect('done')
    } catch(err) {
      console.log(err)
    }
  }
  execute()
}
   
exports.result = (req, res, next) => {
  const mob = req.flash('mob')[0]
  pool.connect().then(() => {
    pool.request().query(`select * from Member where Mobile = '${mob}'`, (err, result) => {
      appendContent('loggg.txt', `${dateNowLong()}--- select * from Member where Mobile = '${mob}'\n`)
      res.render('form/done', {
        mobile: result.recordset[0].Mobile,
        exp: result.recordset[0].Exp,
        gp: result.recordset[0].GoldPoint,
        sp: result.recordset[0].SilverPoint,
        title: '表單查詢結果'
      })
      appendContent('loggg.txt', `${dateNowLong()}--- Mobile:${result.recordset[0].Mobile}, EXP:${result.recordset[0].Exp}, GoldPoint:${result.recordset[0].GoldPoint}, SilverPoint:${result.recordset[0].SilverPoint} updated successfully.\n
      --------------------------------------------------------------------------------------------------------\n`)
    })
  })
}

async function log(cb, qryFN) {
  appendContent('loggg.txt', `${dateNowLong()}-----`.concat(qryFN.concat('\n')))
  await cb
}

function notNull(value){
  if(value === '') return 0
  else return value
}
const dateNowLong = () => moment(new Date()).format('YYYY-MM-DD HH:mm:ss')

function whatPrize(preP,acP){
  if((preP==0)||(acP==0)||(preP<acP)) return false
  else if((preP-acP)<6) return {name:'神準獎', gld:5000, adc:'實際用電量小於預測用電量5度以內'}
  else if((preP-acP)<11) return {name:'精確獎', gld:3000, adc:'實際用電量小於預測用電量10度以內'}
  else if((preP-acP)<21) return {name:'達標獎', gld:1000, adc:'實際用電量小於預測用電量20度以內'}
  else if((preP-acP)>20)return {name:'參加獎', gld:500, adc:'未達到獎勵規定，但有節1度以上用電量'}
  else return false
}