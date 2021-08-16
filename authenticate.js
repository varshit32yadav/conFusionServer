//this file we will use to store authentication strategies that we will configure.
var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;
var User=require('./models/user');

 //configure the passport with new Local Strategy and then export as a module
exports.local=passport.use(new LocalStrategy(User.authenticate()  ));//authenticate()(it is a veryfying function) is supported by passport-local-mongoose...else if it was not then you should write user authentication function like you did in prrevious lecture(post login n all)

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//these 2 function will be provided in User schema to support session