const { ObjectId } = require("mongodb");
var mongoose = require("mongoose"); 

module.exports.get = async (req,res)=>{
      //function for geting all questions
      if(req.query.id){
            // if we need to get data for only one discusion then specify id...
            var q = await mongoose.connection.useDb('Forum').collection('Questions').findOne({_id:ObjectId.createFromHexString(req.query.id)});//o//object id is a way fr query with id... but normal string cannot be used as object id. create fromhexstring() method coverts string to objectid....ok
            //Find its answers
            var answers = await (await mongoose.connection.useDb('Forum').collection('Answers').find({Qid:req.query.id}).toArray());//there re multiple answers.ok
            //to make html line brake
            answers = answers.map(v=>{v.Ans = v.Ans.replace(/(?:\r\n|\r|\n)/g, '<br>');return v;});
            //Find all comments
            var comments =  (await mongoose.connection.useDb('Forum').collection('Comments').find({id:req.query.id}).toArray());
            for(var i=0; i< answers.length;i++){
                  answers[i].comments = await (await mongoose.connection.useDb('Forum').collection('Comments').find({id:answers[i]._id.toString()}).toArray());
            }
            q = {question:q.question.replace(/(?:\r\n|\r|\n)/g, '<br>'),answers,comments};            
      }else{
            var docs = await mongoose.connection.useDb('Forum').collection('Questions').find().toArray()
      }
      res.json(docs || q);
}
//function to answer question
module.exports.answer = async (req,res)=>{
      mongoose.connection.useDb('Forum').collection('Answers').insertOne({Qid:req.query.id,Ans:req.body.answer},()=>{res.json({msg:"success"})})
}
//new qusestion 
module.exports.add = async (req,res)=>{
      var doc = await mongoose.connection.useDb('Forum').collection('Questions').insertOne({question:req.body.question});
      res.json(doc)
}