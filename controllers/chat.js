var mongodb = require("mongoose").connection;

module.exports.getChats = (req,res)=>{
   var chat = {};
    var id = req.payload._id;
   mongodb.useDb('chats').collection("chats").find({
      $or:[{from:id},{recieverId:id}]
   }).toArray().then(
      chats=>{
         chats.forEach(
            (c,i)=>{
               var chatterId = '';
               if(c.from == id){
                  chatterId = c.recieverId;
               }else if (c.recieverId == id){
                  chatterId = c.from;
               }
               if(chat[chatterId]){
                  chat[chatterId].push(c)  
               }else{
                  chat[chatterId] = [c];
               }
            }
         )
         res.json(chat)
      }
   )
}