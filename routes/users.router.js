var express = require("express");
var router = express.Router();
const User = require("../model/users.model");
const { jsonResponse } = require("../lib/jsonResponse");
const createError = require("http-errors");

router.get("/", async function (req, res, next) {
  let results = {};

  try {
    results = await User.find({}, "username password");
  } catch (error) {}
  res.json(results);
});

router.post("/", async function (req, res, next) {
  const { username, password } = req.body;

  if (!username || !password) {
    next(createError(400, "Username and/or password missing"));
  } else {
    const user = new User({ username, password });

    const exists = await user.usernameExists(username);

    if (exists) {
      next(createError(400, "This User exist"));
    } else {
      await user.save();
      res.json({
        message: "User register",
      });
    }
  }
});

module.exports = router;
