// const e = require('express')
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// mongoose.connect('mongodb://localhost:27017/IoT', { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  username: String,
  password: String,
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user", // Giá trị mặc định nếu không có giá trị hoặc giá trị không hợp lệ
  },
  phoneNumber: String,
  address: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "iot2021");
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

UserSchema.statics.findByCredentials = async (username, password) => {
  const user = await User.findOne({ username: username });
  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

//hash password
UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }

  const now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }

  next();
});

UserSchema.statics.checkExist = async (data) => {
  try {
    let user = await this.findOne({ username: data.username });
    if (user) {
      return true;
    } else return false;
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
