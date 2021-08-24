const express =require('express');
const bodyParser=require('body-Parser');
const cors=require('./cors');
var authenticate = require('../authenticate');

const mongoose = require('mongoose');
const Leaders=require('../models/leaders');

const leaderRouter=express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors,(req,res,next)=>{
    Leaders.find({})
    .then((leaders)=>{
        console.log('getting Leaders for you');
        res.statusCode=200;
        res.setHeader('content-Type','application/json');
        res.json(leaders);

    },err=>next(err))
    .catch((err)=>next(err));   
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Leaders.create(req.body)
    .then((leaders)=>{
        console.log('Posting Leaders for you');
        res.statusCode=200;
        res.setHeader('content-Type','application/json');
        res.json(leaders);

    },err=>next(err))
    .catch((err)=>next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('PUT method is not applicable here');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Leaders.remove()
    .then((leaders)=>{
        console.log('Deleting Leaders for you'+leaders);
        res.statusCode=200;
        res.setHeader('content-Type','application/json');
        res.json(leaders);

    },err=>next(err))
    .catch((err)=>next(err));
});

leaderRouter.route('/:leaderId')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})

.get(cors.cors,(req,res,next)=>{             //methods operating for a for particular leader end point
    Leaders.findById(req.params.leaderId)
    .then((leader)=>{
        console.log('getting Leader with id '+ req.params.leaderId);
        res.statusCode=200;
        res.setHeader('content-Type','application/json');
        res.json(leader);

    },err=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{    
    res.statusCode=403;
    res.end('POST operation is not supported on leader/'+req.params.leaderId);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{ 
    Leaders.findByIdAndUpdate(req.params.leaderId,{
        $set:req.body},
        {new:true}
    )
    .then((leader)=>{
        console.log('updating Leader for you');
        res.statusCode=200;
        res.setHeader('content-Type','application/json');
        res.json(leader);

    },err=>next(err))
    .catch((err)=>next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{ 
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((response)=>{
        console.log('deleting the Leader with id'+req.params.leaderId+' for you');
        res.statusCode=200;
        res.setHeader('content-Type','application/json');
        res.json(response);

    },err=>next(err))
    .catch((err)=>next(err));
});
module.exports=leaderRouter;
