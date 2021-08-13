var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter=require('./routes/dishRouter');
var leaderRouter=require('./routes/leaderRouter');
var promoRouter=require('./routes/promoRouter');


//integrating database with http server
const mongoose = require('mongoose');
const Dishes = require('./models/dishes');

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
app.use(cookieParser('12345-67890-09876-54321'));//making signed cookies by giving some secret key to it .

function auth (req, res, next) {
 console.log(req.signedCookies);
  if(!req.signedCookies.user)//if user is not authourized yet i.e there is not cookie in the req header
  {
      var authHeader = req.headers.authorization;
      if (!authHeader) {
          var err = new Error('You are not authenticated!');// no authorization header is given .
          res.setHeader('WWW-Authenticate', 'Basic');
          err.status = 401;
          next(err);
          return;
      }
      //if authHeader is there then we will extract the usern and pass from base encoded 64 dig number 
      var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':'); //we are extracting [1]second element (base64 no.)from the array;
      var user = auth[0];
      var pass = auth[1];
      if (user == 'admin' && pass == 'password') {
        res.cookie('user','admin',{signed:true})  //name of the cookie is "user" and its value ="admin"
        next(); // authorized and you can go to the next middleware(i.e here next is express.static).
      } else {
          var err = new Error('You are not authenticated!');//this for clients for correct registrations.
          res.setHeader('WWW-Authenticate', 'Basic');      
          err.status = 401;
          next(err);
      }
  }
  else{
    if(req.signedCookies.user=='admin'){
      next();//authourized go to next middleware
    }
    else{
      var err = new Error('You are not authenticated!');    
      err.status = 401;
      next(err);
    }

  }

  
}

app.use(auth);
 //we want to do authentication right before the info is fetched from th e server. So before express.static well do authentication
app.use(express.static(path.join(__dirname, 'public'))); //enables us to serve static data from public folder

app.use('/', indexRouter);
app.use('/users', usersRouter);
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
