var mongoose =  require("mongoose");
var mongodb = mongoose.connection;
const { ObjectID } = require("bson");


 module.exports = {
    addPost:(req,res)=>{
        var details = req.body;
        mongodb.useDb("blogs").collection("blog").insertOne(details).then(()=>{
            res.json({msg:"success"});
        });
    },
    viewAllPost: async ()=>{
        let posts = await mongodb.useDb('blogs').collection('blog').find()
        if (posts){
            return( await posts.toArray())
        }else{
            throw new Error('Error while finding all posts')
        }
    },
    getOnePost:async (postId)=>{ 
        let post = await mongodb.useDb('blogs').collection('blog').findOne({_id:ObjectID.createFromHexString(postId)});
        return(post)
    }
 }