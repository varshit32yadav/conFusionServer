const express =require('express');
const bodyParser=require('body-Parser');
const cors=require('./cors');
var authenticate = require('../authenticate');

const mongoose=require('mongoose');
const Promotions=require('../models/promotions');

const promoRouter=express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})

.get(cors.cors,(req,res,next)=>{
    Promotions.find({})
    .then((promo)=>{
        console.log('found your Dishes');
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promo);
    },err=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promotions.create(req.body)
    .then((promo)=>{
        console.log("recieved the Promo"+promo);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promo);
    },err=>next(err))
    .catch((err)=>next(err));

})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('PUT method is not applicable here');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promotions.remove()
    .then((response)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(response);
    },err=>next(err))
    .catch((err)=>next(err));
});

promoRouter.route('/:promoId')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})

.get(cors.cors,(req,res,next)=>{             //methods operating for a for particular Promotion end point
   Promotions.findById(req.params.promoId)
   .then((promo)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json(promo);
   },err=>next(err))
   .catch((err)=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{    
    res.statusCode=403;
    res.end('POST operation is not supported on Promotion/'+req.params.promoId);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{ 
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
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{ 
    Promotions.findByIdAndRemove(req.params.promoId)
    .then((response)=>{
     res.statusCode=200;
     res.setHeader('Content-Type','application/json');
     res.json(response);
    },err=>next(err))
    .catch((err)=>next(err));
});

module.exports=promoRouter;
