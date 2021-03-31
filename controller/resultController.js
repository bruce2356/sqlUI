const pool = require("../sql/config")
const moment = require('moment')
var fs = require('fs')
const promisify = require('util').promisify
const appendContent = promisify(fs.appendFile)
const resultQry = require('../sql/query/resultQry')
const XLSX = require('xlsx-style')
const e = require("express")

exports.add = (req, res, next) => {
  const { 
    GodsHand,
    getGold,
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
  req.flash('mob',params.mob)
  async function execute() {
    try {
      const conn = await pool.connect()
      const request = pool.request()
      if (params.prize !== false)
        await log(request.query(getGold(params)), getGold(params))
      if (params.slv != 0 || params.exp != 0)
        await log(request.query(GodsHand(params)), GodsHand(params))
      res.redirect('done')
    } catch(err) {
      console.log(err)
      appendContent('loggg.txt', `${dateNowLong()}--- ${err}\n`)
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
  return cb.then(res => res)
}

function notNull(value){
  if(value === '') return 0
  else return value
}
const dateNowLong = () => moment(new Date()).format('YYYY-MM-DD HH:mm:ss')

function whatPrize(preP,acP){
  preP = Number.parseInt(preP)
  acP = Number.parseInt(acP)
  if((preP===0)||(acP===0)||(preP<acP)) return false
  else if((preP-acP)<6) return {name:'神準獎', gld:5000, adc:'實際用電量小於預測用電量5度以內'}
  else if((preP-acP)<11) return {name:'精確獎', gld:3000, adc:'實際用電量小於預測用電量10度以內'}
  else if((preP-acP)<21) return {name:'達標獎', gld:1000, adc:'實際用電量小於預測用電量20度以內'}
  else if((preP-acP)>20) return {name:'參加獎', gld:500, adc:'未達到獎勵規定，但有節1度以上用電量'}
  else return false
}
function whatPrizeUpdate(preP,acP){
  preP = Number.parseInt(preP)
  acP = Number.parseInt(acP)
  if((preP===0)||(acP===0)||(preP<acP)) return {name:'', gld:0, adc:''}
  else if((preP-acP)<6) return {name:'神準獎', gld:5000, adc:'實際用電量小於預測用電量5度以內'}
  else if((preP-acP)<11) return {name:'精確獎', gld:3000, adc:'實際用電量小於預測用電量10度以內'}
  else if((preP-acP)<21) return {name:'達標獎', gld:1000, adc:'實際用電量小於預測用電量20度以內'}
  else if((preP-acP)>20) return {name:'參加獎', gld:500, adc:'未達到獎勵規定，但有節1度以上用電量'}
  else return {name:'未得獎', gld:0, adc:'實際用電量大於預測用電量，故未得獎'}
}
exports.addSilver = (req, res, next) => {
  const { GodsHand } = resultQry
  let id = ''
  let obj
  async function execute() {
    
    try {
      // result.recordset[0].ID
      const conn = await pool.connect()
      const request = pool.request()
      function a () {
        return `select * from Member where Mobile = '${req.params.mob}'`
      }
      const nowID = await log(request.query(a()), a()).then(res => res.recordset[0].ID)
      obj = await setParams(req.params, nowID)
      if (obj.slv != 0 || obj.exp != 0){
        console.log(obj)
        await log(request.query(GodsHand(obj)), 'API---'+ GodsHand(obj))
      }
      res.send(req.params)
      appendContent('loggg.txt', `${dateNowLong()}---done----------------------------------------------------------------------------------------------------\n`)
    }
    catch(err) {
    console.log(err)
    appendContent('loggg.txt', `${dateNowLong()}--- ${err}\n`)
    } 
  }
  execute()
}

exports.apiaddgold = (req, res, next) => {
  const { 
    apigold,
  } = resultQry
  const pdp= notNull(req.params.pdp)
  const atp= notNull(req.params.acp)
  const params = {
    mob: req.params.mob,
    pdp: pdp,
    atp: atp,
    prize: whatPrize(pdp,atp),
    dateNowShort: moment(new Date()).format('YYYYMMDD'),
    dateNowLong: dateNowLong(),
    timestamp: moment().unix()
  }
  async function execute() {
    try {
      const conn = await pool.connect()
      const request = pool.request()
      if (params.prize !== false)
        {
          await log(request.query(apigold(params)), apigold(params))
          res.send(req.params)
          appendContent('loggg.txt', `${dateNowLong()}---done----------------------------------------------------------------------------------------------------\n`)
        }
        else{
          res.send('fail')
          appendContent('loggg.txt', `${dateNowLong()}${params}\n`)
          appendContent('loggg.txt', `${dateNowLong()}---fail----------------------------------------------------------------------------------------------------\n`)
        }
    } catch(err) {
      console.log(err)
      appendContent('loggg.txt', `${dateNowLong()}--- ${err}\n`)
    }
  }
  execute()
}

async function setParams(params,id) {
  return {
    mob:  params.mob,
    id: id,
    slv: notNull(params.slv),
    exp: notNull(params.exp),
    dateNowShort: moment(new Date()).format('YYYYMMDD'),
    dateNowLong: dateNowLong(),
    timestamp: moment().unix()
  }
}

async function executeM(params) {
  const { multi } = resultQry
  try {
    const conn = await pool.connect()
    const request = pool.request()
    if (params.prize !== false || params.slv != 0 || params.exp != 0)
      await log(request.query(multi(params)), multi(params))
  } catch(err) {
    console.log(err)
    appendContent('loggg.txt', `${dateNowLong()}--- ${err}\n`)
  }
}


exports.do_file = (req, res, next) => {
  
  const workbook = XLSX.readFile('./upload/file.xlsx', { cellStyles: true })
  const worksheet = workbook.Sheets[workbook.SheetNames[0]]
  const { multi } = resultQry
  //轉成ary
  const target = Object.values(worksheet)
  const range = target.length
  //for起來做
  if((range-2) % 5 == 0) {
    try {
      let promiseArr = []
      for(let i = 6; i <= range-2; i+=5) {
        const tempPdp=target[i+3].v
        const tempAtp=target[i+4].v
        const params = {
          mob: target[i].v,//每行第一格
          slv: notNull(target[i+2].v),//第三格notNull(req.body.addSlv),
          exp: notNull(target[i+1].v),//notNull(req.body.addExp),
          pdp: tempPdp,
          atp: tempAtp,
          prize: whatPrizeUpdate(tempPdp,tempAtp),
          dateNowShort: moment(new Date()).format('YYYYMMDD'),
          dateNowLong: dateNowLong(),
          timestamp: moment().unix()
        }
        let p = executeM(params)
        promiseArr.push(p)
      }
      Promise.all(promiseArr).then(() => {
        appendContent('loggg.txt', `${dateNowLong()}---File DONE --------------------------------------------------------------------------------------------------------\n`)
        req.flash('result','file done sucessfully, go check log.')
        res.redirect('upload/ULdone')
      })
    } catch(err) {
      appendContent('loggg.txt', `${dateNowLong()}--- ${err}\n`)
      res.redirect('upload/ULdone') 
      req.flash('result','runtime error: '+err+', go check log.')
      return
    }
  } else {
    appendContent('loggg.txt', `${dateNowLong()}---檔案格式有誤\n --------------------------------------------------------------------------------------------------------\n`)
    res.redirect('upload/ULdone')
    req.flash('result','nice try man(check files form).')
  }
}
exports.done_file = (req, res, next) => {
  res.render('ULdone', {title: 'Done',text: req.flash('result')[0] })
}