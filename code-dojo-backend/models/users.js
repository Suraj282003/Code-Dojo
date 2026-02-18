const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    select: false,
    required: function () {
    return this.provider === "local";
    },
  },

  provider: {
  type: String,
  enum: ["local", "google"],
  default: "local",
  },

  signUpAt: {
    type: Date,
    default: Date.now,
  },

  level: {
    type: Number,
    default: 1,
    min: 1,
  },

  battleCoins: {
    type: Number,
    default: 0,
    min: 0,
  },

  refreshToken: {
    type: String,
  },
  wins: {
    type: Number,
    default: 0,
  },
});

// Compare password
userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { id: this._id, jti: randomUUID() },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRE }
  );
};

// Hash password before saving
// Hash password before saving
userSchema.pre("save", async function () {
  // 1. If it's a Google user, skip password logic entirely
  if (this.provider === "google") {
    return;
  }

  // 2. Only hash if the password exists and was modified
  if (this.password && this.isModified("password")) {
    try {
      this.password = await bcrypt.hash(this.password, 12);
    } catch (err) {
      throw err; // Mongoose will catch this and pass it to your controller
    }
  }
});


// refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { id: this._id, jti: randomUUID() },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE }
  );
};

module.exports = mongoose.model("User", userSchema);
