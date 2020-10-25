const { ObjectId } = require("bson");
var mongoose =  require("mongoose");
var User = mongoose.model("User")



//Get User

module.exports.getProfile = (req, res) => {
   var id = req.params.id;
   User.findById(id).exec((err, user) => {
     if (err || !user) {
       return res.status(400).json({
         error: "No User was found in DB",
       });
     }
     delete user.hash ;
     delete user.salt;
     res.json(user)
   });
};

//set profile
module.exports.setProfile = (req,res)=>{
   var id = req.payload._id;
   var body = req.body;
   var data = {};
   if(body.name)data.name = body.name;
   if(body.email)data.email = body.email;
   if(body.aboutMe)data.aboutMe = body.aboutMe;
   if(body.age)data.age = body.age;
   User.findByIdAndUpdate(id,{$set:data}).then(
      ()=>{
         res.json({msg:"success"}) 
      }
   )
}

module.exports.getallusers = (req,res)=>{
   User.find().then((users)=>{
      users.forEach(
         (u)=>{
            delete u.hash;
            delete u.salt;
         }
      );
      res.json(users)
   })
}
