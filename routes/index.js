var express = require('express');
var router = express.Router();

//controllers
var chat = require("../controllers/chat")
var ctrlAuth = require('../controllers/auth');
var blog = require('../controllers/blog');
var profile = require('../controllers/profile')
var comment = require('../controllers/comment')
var question = require('../controllers/question')
//implemting all of them in routes
// look jwt validity
router.post('/loginJWT', ctrlAuth.authGuard, ctrlAuth.refreshToken, (req,res)=>{
  res.json({token:req.newToken});
});

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
//main
router.get('/getchats',ctrlAuth.authGuard,chat.getChats)
router.get('/getallusers',profile.getallusers);
router.post('/setProfile',ctrlAuth.authGuard,profile.setProfile);
router.get('/getProfile/:id',profile.getProfile)

router.post('/addblog',blog.addPost)



router.get('/blog/:postid',async (req, res)=>{
  let postId = req.params.postid;
  let post = await blog.getOnePost(postId)
  res.json(post)
})

router.get('/blogs',async(req, res)=>{
  let posts = await blog.viewAllPost();
  res.json(posts)
})

router.get('/question', question.get)
router.post('/question/new', question.add)
router.post('/answer', question.answer)

router.post('/comment/new', comment.new);

module.exports =router;