const express=require('express');
const bodyParser = require('body-parser');

const mongoose=require('mongoose');
const Dishes=require('../models/dishes');

const dishRouter=express.Router();  //mini express application

dishRouter.use(bodyParser.json());
dishRouter.route('/')    //by using this approach we r declaring several end oints at one single location where you can chain all the methods to use them
.get((req,res,next)=>{
    Dishes.find({})      //mongoose operation
    .then((dishes)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes); //sending dishes in the response body to the client
    },err=>next(err))      //next();   //this will go down to all the methods who r taking(/dishes)as their end points
    .catch((err)=>next(err));
   
})
.post((req,res,next)=>{    //first .all() will execute n after next(); theses all methods will be exectuing 
    Dishes.create(req.body)
    .then((dishes)=>{
        console.log("recieved the dihes"+dishes);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);
    },err=>next(err))
    .catch((err)=>next(err));
    
})
.put((req,res,next)=>{ 
 res.statusCode=403;
 res.end('PUT operation is not supported');
})
.delete((req,res,next)=>{ 
    Dishes.remove()
    .then((response)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(response);
    },err=>next(err))
    .catch((err)=>next(err));
});

dishRouter.route('/:dishId')
.get((req,res,next)=>{             //methods operating for a for particular dish end point
    Dishes.findById(req.params.dishId) 
    .then((dishes)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes); //sending dishes in the response body to the client
    },err=>next(err))     
    .catch((err)=>next(err));  
})
.post((req,res,next)=>{    
    res.statusCode=403;
    res.end('POST operation is not supported on dish/'+req.params.dishId);
})
.put((req,res,next)=>{ 
    Dishes.findByIdAndUpdate(req.params.dishId,
        {$set:req.body},
        {new:true})   //when it is updated then take that dish in res body 
        .then((dish)=>{
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(dish); //sending dishes in the response body to the client
        },err=>next(err))     
        .catch((err)=>next(err)); 
})
.delete((req,res,next)=>{ 
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((response)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(response);
    },err=>next(err))
    .catch((err)=>next(err));
});


module.exports=dishRouter;


