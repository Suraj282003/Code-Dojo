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

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
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

  // ===============================
  // 🔥 RANKED SYSTEM FIELDS
  // ===============================

  rating: {
    type: Number,
    default: 1200,
    min: 0,
  },

  rank: {
    type: String,
    enum: ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master"],
    default: "Bronze",
  },

  wins: {
    type: Number,
    default: 0,
  },

  losses: {
    type: Number,
    default: 0,
  },

  draws: {
    type: Number,
    default: 0,
  },

  totalMatches: {
    type: Number,
    default: 0,
  },

  refreshToken: {
    type: String,
  },

});


// ========================================
// 🔥 AUTO UPDATE RANK BASED ON RATING
// ========================================
userSchema.methods.updateRank = function () {

  if (this.rating >= 2000) this.rank = "Master";
  else if (this.rating >= 1700) this.rank = "Diamond";
  else if (this.rating >= 1400) this.rank = "Platinum";
  else if (this.rating >= 1200) this.rank = "Gold";
  else if (this.rating >= 1000) this.rank = "Silver";
  else this.rank = "Bronze";
};


// ========================================
// PASSWORD COMPARE
// ========================================
userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};


// ========================================
// ACCESS TOKEN
// ========================================
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { id: this._id, jti: randomUUID() },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRE }
  );
};


// ========================================
// REFRESH TOKEN
// ========================================
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { id: this._id, jti: randomUUID() },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE }
  );
};


// ========================================
// HASH PASSWORD
// ========================================
userSchema.pre("save", async function () {

  if (this.provider === "google") return;

  if (this.password && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }

});

module.exports = mongoose.model("User", userSchema);
