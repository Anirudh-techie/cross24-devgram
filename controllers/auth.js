var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var jwt = require('express-jwt');

module.exports.register = function(req, res) {
  var user = new User();

  user.name = req.body.name;
  user.email = req.body.email;
//setting email name
  user.setPassword(req.body.password);
//setting pwd
//saving user in db
  user.save(function(err) {
    var token;
    ///givng token to client
    token = user.generateJwt();
    res.status(200);
    res.json({
      "token" : token
    });
  });
};

module.exports.login = function(req, res) {

  passport.authenticate('local', function(err, user, info){
    var token;
    // If Passport throws/catches an error.....
    if (err) {
      res.status(404).json(err);
      return;
    }
    // If a user is found.....
    if(user){
      token = user.generateJwt(); 
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found....
      res.status(401).json(info);
    }
  })(req, res)

};
//auth gurd checks validy of jwt
module.exports.authGuard = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});
//refreshes token..
module.exports.refreshToken = function(req,res,next){
    User
    .findById(req.payload._id)
    .exec(function(err, user) {
      if(user){
        var token = user.generateJwt();
        req.newToken = token;
        next();
      }else{
        res.status(401).json({msg:"user not found"})
      }
    });
}