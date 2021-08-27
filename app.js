var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session=require('express-session');
var fileStore=require('session-file-store')(session);
var passport=require('passport');
var authenticate=require('./authenticate');
var config=require('./config');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter=require('./routes/dishRouter');
var leaderRouter=require('./routes/leaderRouter');
var promoRouter=require('./routes/promoRouter');
var uploadRouter=require('./routes/uploadRouter');
var favoriteRouter=require('./routes/favoriteRouter');

//integrating database with http server
const mongoose = require('mongoose');
const Dishes = require('./models/dishes');
const { register } = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });


var app = express();

//setting up a middleware such that any req coming to unsecure port 3000,will be redirected to secure port 3443(https)
app.all('*',(req,res,next)=>{ //(*->for all req incoming)
  if(req.secure)  // if(if req is coming in sec server go to next middleware)
      return next();
  else {
     res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
   }  
       //(307)represents that the target resource resides temporarily under the different url and user agent must not change the req method if automatic redirection is performed by the server.
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));//static server has been set up
//app.use(cookieParser('12345-67890-09876-54321'));//making signed cookies by giving some secret key to it .


app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(express.static(path.join(__dirname, 'public'))); //enables us to serve static data from public folder

app.use('/dishes',dishRouter);
app.use('/leaders',leaderRouter);
app.use('/promotions',promoRouter);
app.use('/imageUpload',uploadRouter);
app.use('/favorites',favoriteRouter);



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

module.exports = app;                        // mongod --dbpath=data --bind_ip 127.0.0.1
