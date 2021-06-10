require("dotenv").config();

const Mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Token = require("./token.model");

const { ACCES_TOKEN_SECRECT, REFRESH_TOKEN_SECRECT } = process.env;

const UserSchema = new Mongoose.Schema({
  username: { type: String, requiered: true, unique: true },
  password: { type: String, requiered: true },
  name: { type: String },
});

UserSchema.pre('save', function(next){
  if (this.isModified('password') || this.isNew) {
    const document = this;
    bcrypt.hash(document.password, 10, (err, hash) => {
      if (err) {
        next(err);
      } else {
        document.password = hash;
        next();
      }
    });
  } else {
    next();
  }
});

UserSchema.methods.usernameExists = async (username) => {
  try {
    let result = await Mongoose.model("User").find({ username: username });
    return result.length > 0;
  } catch (error) {
    return error;
  }
};
UserSchema.methods.isCorrectPassword = async (password, hash) => {
  try {
    const same = await bcrypt.compare(password, hash);
    return same;
  } catch (error) {
    return error;
  }
};

UserSchema.methods.createAccesToken = () => {
  const { id, username } = this;

  const accessToken = jwt.sign(
    { user: { id, username } },
    ACCES_TOKEN_SECRECT,
    { expiresIn: "1d" }
  );
  return accessToken;
};

UserSchema.methods.refreshToken = async () => {
  const { id, username } = this;
  const refreshToken = jwt.sign(
    { user: { id, username } },
    REFRESH_TOKEN_SECRECT,
    { expiresIn: "10d" }
  );

  try {
    await new Token({ token: refreshToken }).save();
    return refreshToken;
  } catch (err) {
    next(new Error("Error creating refresh Token"));
  }
};

module.exports = Mongoose.model('User', UserSchema);