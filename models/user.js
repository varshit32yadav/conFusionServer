var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 //updating the user schema model so as to use passport locla mongoose
 var passportLocalMongoose=require('passport-local-mongoose');

 var User = new Schema({
    firstname: {
      type: String,
        default: ''
    },
    lastname: {
      type: String,
        default: ''
    },
    admin:   {
        type: Boolean,
        default: false
    }
});
User.plugin(passportLocalMongoose); //using it as plugin .

module.exports = mongoose.model('User', User);