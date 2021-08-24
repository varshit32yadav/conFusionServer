//putting all the info related to the CORS
  const express=require('express');
  const app=express();
  const cors=require('cors');
  const whitelist = ['http://localhost:3000', 'https://localhost:3443'];
  
  const corsOptionsDelegate=(req,callabck)=>{
      var corsOptions;
        if(whitelist.indexOf(req.header('Origin'))!==-1) //to check if the mentioned origin in the header req is in the whitelist or not .
            corsOptions={origin:true};
        else
            corsOptions={origin:false};  
        callabck(null,corsOptions);      
  } ;
  exports.cors=cors(); //exporting standard cors  it will reply back with (Access-control-reply-Origin)with wildcard[*](for basic  reqs like GET );

  exports.corsWithOptions=cors(corsOptionsDelegate); //specifying parameters in cors for applying cors with specific options in a particukar route; 
