var ws = require("ws")
var server = require("./main");
var jwtparser = require("jsonwebtoken");
var mongodb = require("mongoose").connection;


var users = {};
var socket = new ws.Server({server:server,path:'/api/chats'});
socket.on("connection", (connection)=>{
   var initdone = false
   connection.on("message",(data)=>{
      data= JSON.parse(data);
      jwtparser.verify(data.jwt,'MY_SECRET');
      var jwt = JSON.parse(Buffer.from(data.jwt.split('.')[1],'base64').toString());
      
      if(data.init  && !initdone){
         users[data.id] = (connection);
         initdone=true;
         return;
      }
      if(users[data.recieverId]){
        users[data.recieverId].send(JSON.stringify({
           content:data.content,
           recieverId:data.recieverId,
           from: jwt._id,
           time: data.time
        }))
        users[data.recieverId].on("close",()=>{
           delete users[data.recieverId];
        })
      }
      mongodb.useDb("chats").collection("chats").insertOne({
           content:data.content,
           recieverId:data.recieverId,
           from: jwt._id,
           time: data.time
        })
   });

});