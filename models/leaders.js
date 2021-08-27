const mongoose=require('mongoose');
const Schema =mongoose.Schema;

const leaderSchema=new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    image:{
        type:String,
        required:true
    },
    designation:{
        type:String,
        required:true
    },
    featured:{
        type:Boolean,
        default:false
    },
    description:{
        type:String,
        required:true
    }

},
{
    timestamps:true
});
var leader=mongoose.model('Leader',leaderSchema);
module.exports=leader;
