const mongoose = require("mongoose")

const challengeRunSchema = new mongoose.Schema({
  userId: {
    type: String, // or ObjectId later
    required: true,
  },

  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  currentIndex: {
    type: Number,
    default: 0, // starts from first problem
  },

  timeRemaining: {
    type: Number, // seconds
    required: true,
  },

  status: {
    type: String,
    enum: ["ACTIVE", "FAILED", "COMPLETED"],
    default: "ACTIVE",
  },

  startedAt: {
    type: Date,
    default: Date.now,
  },

  endedAt: {
    type: Date,
    default: null,
  },
})

module.exports = mongoose.model("ChallengeRun", challengeRunSchema)
