var app = require("./app");

module.exports = app.listen(5000,()=>{console.log("Server started at 5000")});

require("./ws")