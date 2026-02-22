const mongoose = require("mongoose");

const battleSchema = new mongoose.Schema({

  type: {
    type: String,
    enum: ["ranked", "casual"],
    default: "ranked",
  },

  players: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      name: String,

      ratingSnapshot: Number, // rating at match start

      passedCount: {
        type: Number,
        default: 0,
      },

      lastSubmissionAt: Date,
    },
  ],

  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
  },

  question: {
    title: String,
    description: String,
    testCases: Array,
  },

  status: {
    type: String,
    enum: ["active", "finished"],
    default: "active",
  },

  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  resultType: {
    type: String,
    enum: ["NORMAL", "TIMEOUT", "DISCONNECT", "DRAW"],
  },

  ratingChange: {
    winnerDelta: Number,
    loserDelta: Number,
  },

  startedAt: {
    type: Date,
    required: true,
  },

  finishedAt: Date,

  timeLimit: {
    type: Number,
    required: true,
  },

}, { timestamps: true });

module.exports = mongoose.model("Battle", battleSchema);
