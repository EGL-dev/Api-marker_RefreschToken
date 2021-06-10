require("dotenv").config();

const Mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { ACCES_TOKEN_SECRECT, REFRESH_TOKEN_SECRECT } = process.env;

const UserSchema = new Mongoose.Schema({
  username: { type: String, requiered: true, unique: true },
  password: { type: String, requiered: true },
  name: { type: String },
});

UserSchema.pre("save", (next) => {
  if (this.isModified("password") || this.isNew) {
    const document = this;
    bcrypt.hash(document.password, 10, (err, hash) => {
      if (err) {
        next(err);
      } else {
        document.password = hash;
        next();
      }
    });
    }else{
        next();
        
    }
});
