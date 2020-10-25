var mongoose = require("mongoose");

module.exports.new = (req,res)=>{
   if(req.query.id){
      mongoose.connection.useDb("Forum").collection("Comments").insertOne({id:req.query.id,comment:req.body.comment}).then(
         ()=>{
            res.json({msg:"success"});
         }
      )
      
   }else{
      res.status(403).json({msg:"no id "})
   }
}