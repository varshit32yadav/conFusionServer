//this file we will use to store authentication strategies that we will configure.
var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;
var FacebookTokenStrategy=require('passport-facebook-token');
var User=require('./models/user');


//for json web tokens use
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config.js');





 //configure the passport with new Local Strategy and then export as a module
exports.local=passport.use(new LocalStrategy(User.authenticate()  ));//authenticate()(it is a veryfying function) is supported by passport-local-mongoose...else if it was not then you should write user authentication function like you did in prrevious lecture(post login n all)

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//these 2 function will be provided in User schema to support session

exports.getToken=function(user){  //this will create   the token ,which is created after user is logedin(i.e authenticated) and give it for us.
    return jwt.sign(user,config.secretKey,{expiresIn:3600}); //user parameter i s used as a payload
};

//to add strategies for JWT
var opts={};
opts.jwtFromRequest=ExtractJwt.fromAuthHeaderAsBearerToken(); //to extract it from req messg
opts.secretOrKey=config.secretKey;

//exporting jwt strategies as module.
exports.jwtPassport=passport.use(new JwtStrategy(opts,(jwt_payload,done)=>{   //done callback is used passback info to the passport which will be used for loading things on the req messg(Passport will use the strategy to extract the info and then load it on the req messg).
        console.log("JWT payload"+jwt_payload);
        User.findOne({_id:jwt_payload._id},(err,user)=>{
            if(err){
                return done(err,false)//user doesnot exist.
            }
            else if(user!=null){
                return done(null,user);//user exist
            }
            else{  //to create new user but here not doing it so flase.
                return done(null,false);//you can here basically create new user butu for simplicity here we didnt create any.
            }
        });
})); 

exports.verifyUser=passport.authenticate('jwt',{session:false});  //using jwt strategy to verify the user.and sessions are nit there in JWT so false.

exports.verifyAdmin=((req,res,next)=>{
     if(req.user.admin){
         return next();
     }
     else
     {
         var err=new Error("you are not authorized to perform this operation(only admin)");
         err.status=403;
         return next(err);
          
     }
});
exports.facebookPassport = passport.use(new FacebookTokenStrategy({
        clientID: config.facebook.clientId,    
        clientSecret: config.facebook.clientSecret
    }, (accessToken, refreshToken, profile, done) => {//you will start you work ones the express gets access token from Fb by user. And it got resources from FB by showing that token to FB. BEfore it middleware handles evrything 
        User.findOne({facebookId: profile.id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            if (!err && user !== null) {  //found the user in database
                return done(null, user);
            }
            else {                            //create a new user 
                user = new User({ username: profile.displayName });
                user.facebookId = profile.id;
                user.firstname = profile.name.givenName;
                user.lastname = profile.name.familyName;
                user.save((err, user) => {
                    if (err)
                        return done(err, false);
                    else
                        return done(null, user);
                })
            }
        });
    }
));
