const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  pass: {
    type: String,
  },
  Tokens: [
    {
      token: {
        type: String,
      },
    },
  ],
});


StudentSchema.methods.generatetoken = async function (next) {
  try {
    const token = await jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.Tokens = await this.Tokens.concat({ token: token });
    await this.save();
    console.log(token);
    return token
    next();
  } catch (error) {
    console.log(error);
  }
};
StudentSchema.pre("save", async function (next) {
  if (this.isModified("pass")) {
    try {
      this.pass = await bcrypt.hash(this.pass, 12);
      // console.log(this.pass);
      next();
    } catch (error) {
      console.log(error);
    }
  }
});

module.exports = new mongoose.model("student1", StudentSchema);
