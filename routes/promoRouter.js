const express =require('express');
const bodyParser=require('body-Parser');
const promoRouter=express.Router();
promoRouter.use(bodyParser.json());
promoRouter.route('/')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('<html><body><h1>will send all your Promotions</h1></body></html>');
})
.post((req,res,next)=>{
    res.end('we will add the Promo '+req.body.name+" and details as well "+req.body.description);
})
.put((req,res,next)=>{
    res.statusCode=403;
    res.end('PUT method is not applicable here');
})
.delete((req,res,next)=>{
    res.end('deleted your Promotions '+req.body.name +' successfully');
});

promoRouter.route('/:promoId')
.get((req,res,next)=>{             //methods operating for a for particular Promotion end point
    res.end('will send details of the  Promotion '+req.params.promoId+'to you'); 
})
.post((req,res,next)=>{    
    res.statusCode=403;
    res.end('POST operation is not supported on Promotion/'+req.params.promoId);
})
.put((req,res,next)=>{ 
res.write('updating the Promotion \n');//used to add a line to the reply msg
res.end('will update the Promtion:/'+req.params.promoId+'with details:'+req.body.description );
})
.delete((req,res,next)=>{ 
res.end('deleting Promotion/'+req.params.promoId);
});
module.exports=promoRouter;
