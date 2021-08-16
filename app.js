var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session=require('express-session');
var fileStore=require('session-file-store')(session);
var passport=require('passport');
var authenticate=require('./authenticate');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter=require('./routes/dishRouter');
var leaderRouter=require('./routes/leaderRouter');
var promoRouter=require('./routes/promoRouter');


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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));//static server has been set up
//app.use(cookieParser('12345-67890-09876-54321'));//making signed cookies by giving some secret key to it .

app.use(session({     //created session object.
    name:"session-id",  //name of cookie
    secret:"12345-67890-09876-54321",
    saveUninitialized:false,
    resave:false,
    store:new fileStore()
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', indexRouter);
app.use('/users', usersRouter);
//all the endpoints above authentication function dont need any authentication but all below it needs auth.
function auth (req, res, next) {

  if(!req.user) { //req.user will be loaded by passport.session middleware automatically.
      var err = new Error('You are not authenticated bro!'); //i.e. you are not logged in yet.
      err.status = 403;
      return next(err);
  }
  else    //if req.user is present that means passport has done the authentication (authenticat())and send user properties int he session
    next();
   
}

app.use(auth);
 //we want to do authentication right before the info is fetched from th e server. So before express.static well do authentication
app.use(express.static(path.join(__dirname, 'public'))); //enables us to serve static data from public folder

app.use('/dishes',dishRouter);
app.use('/leaders',leaderRouter);
app.use('/promotions',promoRouter);

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
