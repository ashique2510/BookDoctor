var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var hospitalRoutert =require('./routes/hospital')
var doctorRouter=require('./routes/doctor')
var session=require('express-session')
const bodyParser = require('body-parser');
const dotenv=require('dotenv').config()
const nocache = require("nocache");


var Handlebars = require('handlebars');

Handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});


//use hbs

var hbs=require('express-handlebars')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


// handle bar string checking
const isEqualHelperHandlerbar = function(a, b) {
  if (a == b) {
      return this; 
  } else { 
      return this; 
  } 
}
// template engine settup(and table no count at 1)

// app.engine('hbs',hbs.engine({helpers:{inc:function(value,option){
//   return parseInt(value)+1;
// }},extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/'}))


app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/'}))


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(nocache());

// 

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Session time set
app.use(session({secret:"key", resave:false,saveUninitialized:true, cookie:{maxAge:600000}}));
// local session setup
app.use(function(req,res,next){
  res.locals.session=req.session
  next()
})

app.use('/', userRouter);
app.use('/admin', adminRouter);
app.use('/hospital',hospitalRoutert)
app.use('/doctor',doctorRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
