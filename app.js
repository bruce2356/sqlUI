const createError = require('http-errors')
const fs = require('fs')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const morgan = require('morgan')
const flash = require('connect-flash');
// const bodyParser = require('body-parser')
const indexRouter = require('./routes/index')
const formRouter = require('./routes/form')
const resultRouter = require('./routes/result')
const engine = require('ejs-locals')
const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.engine('ejs', engine)
app.use(morgan('dev'))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(session({ cookie: { maxAge: 60000 }, 
  secret: 'woot',
  resave: false, 
  saveUninitialized: false}))
app.use(cookieParser())
app.use(flash())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/form', formRouter)
app.use('/result', resultRouter)
app.use('/done', resultRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
