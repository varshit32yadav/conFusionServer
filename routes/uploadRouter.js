const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');
const cors=require('./cors');

//configurating multer (it adds file and body object inside req body).
var storage=multer.diskStorage({  //(its a disk storage engine which gives you full control of storing the file in the disk)
    destination:(req,file,cb)=>{  //dest folder where files will be stored
       cb(null,'public/images');  //(err,dest folder)

    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname);      //gives orig name of file uploaded from client side
             
    } 

});

//for file filter i.e which kind of files(img file) you upload
const imgFileFilter=(req,file,cb)=>{ //through cb fnction i will pass info back to my muilter that enables us to specify how will store the info
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/))  
        return cb(new Error('you can upload only image files')); 
    else 
        cb(null,true);    
};
const upload=multer({storage:storage,fileFilter:imgFileFilter});
//------------------------------------------------------------------(configured)

const uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());
uploadRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors ,authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload');
})
.post(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => { //single func takes name of the form feild which specifies the file as parameter. After upload you file would have been successfully uploadedso handle it next
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
})
.put(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload');
})
.delete(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /imageUpload');
});


module.exports=uploadRouter;