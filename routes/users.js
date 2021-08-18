var express = require('express');
var bodyParser=require('body-parser');
var authenticate=require('../authenticate');
var router = express.Router();
var User=require('../models/user');
var passport=require('passport');
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with some resource');
});
//signup
router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      if (req.body.firstname)
        user.firstname = req.body.firstname;
      if (req.body.lastname)
        user.lastname = req.body.lastname;
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      });
    }
  });
});

//login  here we already expect the login details to be there in the body of the incoming req message .(rather then checking in the authentication header like we did earlier);
router.post('/login', passport.authenticate('local'),    //passport.authenticate('local') automatically checks the authentication and adds user property(req.user) and gives error if not auth. then only it go forward.
            (req, res, ) => {
              var token=authenticate.getToken({_id:req.user._id}); //we r creating the token when the authentication is done by just giving user id as info for the user to get recognised .
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: true,token:token, status: 'You are successfully logged in!'});
              //pass the token back to the user
            });

//logout            
router.get('/logout', (req, res) => {
  if (req.session) {      //i.e you must logout the user that is logged in 
    req.session.destroy();//remove session from server side
    res.clearCookie('session-id');//asking client to delete it
    res.redirect('/');//reditrect it to homepage
  }
  else {
    var err = new Error('You are not logged in dear!');
    err.status = 403;
    next(err);
  }
});

module.exports = router;
