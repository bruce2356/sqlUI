exports.index = (req, res, next) => {
    res.render('form/result', {title: '表單查詢結果'})
  }
  
  exports.add = (req, res, next) => {

    let exp = `經驗值${req.body.addExp}`
   
   
    let slv = `銀點${req.body.addSlv}`
    
    let gld = `金點${req.body.addGld}`
    let info = {
        exp: exp,
        slv: slv,
        gld: gld,
    }
    req.flash('info', info)
    res.redirect('done')
  }
  
  exports.result = (req, res, next) => {
    const info = req.flash('info')[0]
    console.log(info)
    res.render('form/done', {
      title: '更新結果',
      info: info
    })
  }