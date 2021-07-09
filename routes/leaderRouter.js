const express =require('express');
const bodyParser=require('body-Parser');
const leaderRouter=express.Router();
leaderRouter.use(bodyParser.json());
leaderRouter.route('/')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('<html><body><h1>will send all your Leaders</h1></body></html>');
})
.post((req,res,next)=>{
    res.end('we will add the leader '+req.body.name+"and details as well "+req.body.description);
})
.put((req,res,next)=>{
    res.statusCode=403;
    res.end('PUT method is not applicable here');
})
.delete((req,res,next)=>{
    res.end('deleted your leader '+req.body.name +'successfully');
});

leaderRouter.route('/:leaderId')
.get((req,res,next)=>{             //methods operating for a for particular leader end point
    res.end('will send details of the  leader'+req.params.leaderId+'to you'); 
})
.post((req,res,next)=>{    
    res.statusCode=403;
    res.end('POST operation is not supported on leader/'+req.params.leaderId);
})
.put((req,res,next)=>{ 
res.write('updating the leader \n');//used to add a line to the reply msg
res.end('\n will update the leader:/'+req.params.leaderId+'with details:'+req.body.description );
})
.delete((req,res,next)=>{ 
res.end('deleting leader/'+req.params.leaderId);
});
module.exports=leaderRouter;
