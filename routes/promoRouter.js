const express =require('express');
const bodyParser=require('body-Parser');
var authenticate = require('../authenticate');

const mongoose=require('mongoose');
const Promotions=require('../models/promotions');

const promoRouter=express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/')
.get((req,res,next)=>{
    Promotions.find({})
    .then((promo)=>{
        console.log('found your Dishes');
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promo);
    },err=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{
    Promotions.create(req.body)
    .then((promo)=>{
        console.log("recieved the Promo"+promo);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promo);
    },err=>next(err))
    .catch((err)=>next(err));

})
.put(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode=403;
    res.end('PUT method is not applicable here');
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    Promotions.remove()
    .then((response)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(response);
    },err=>next(err))
    .catch((err)=>next(err));
});

promoRouter.route('/:promoId')
.get((req,res,next)=>{             //methods operating for a for particular Promotion end point
   Promotions.findById(req.params.promoId)
   .then((promo)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json(promo);
   },err=>next(err))
   .catch((err)=>next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{    
    res.statusCode=403;
    res.end('POST operation is not supported on Promotion/'+req.params.promoId);
})
.put(authenticate.verifyUser,(req,res,next)=>{ 
    Promotions.findByIdAndUpdate(req.params.promoId,{
        $set:req.body},
        {new:true}    //when it is updated then take that dish in res body 
    )
    .then((updatedpromo)=>{

        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(updatedpromo);
    },err=>next(err))
    .catch((err)=>next(err));
})
.delete(authenticate.verifyUser,(req,res,next)=>{ 
    Promotions.findByIdAndRemove(req.params.promoId)
    .then((response)=>{
     res.statusCode=200;
     res.setHeader('Content-Type','application/json');
     res.json(response);
    },err=>next(err))
    .catch((err)=>next(err));
});

module.exports=promoRouter;
