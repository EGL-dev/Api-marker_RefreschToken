var express = require("express");
var router = express.Router();
const User = require("../model/users.model");

router.get("/", async function (req, res, next) {
  let results = {};

  try {
    results = await User.find({}, "username password");
  } catch (error) {}
  res.json(results);
});

router.post('/', async function(req, res, next) {
  const {username, password} = req.body;

  if(!username || !password){
    next();
  }else{
    const user = new User({username, password});

    const exists = await user.usernameExists(username);

    if(exists){
      res.json({
        message: 'user exists'
      });
    }else{
      await user.save();
      res.json({
        message: "User register",
      });
    }
  }
});


module.exports = router;
