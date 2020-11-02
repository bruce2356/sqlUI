exports.index = (req, res, next) => {
  res.render('form/index', {title: '表單查詢'})
}

exports.query = (req, res, next) => {
  const queryString = req.body.mob
  let result = {Mobile : queryString}
  req.flash('info', queryString)
  req.flash('sqlstuff', result)
  res.redirect('result')
}

exports.result = (req, res, next) => {
  const result = req.flash('info')[0]
  res.render('form/result', {
    title: '表單查詢結果',
    mob: result
  })
}