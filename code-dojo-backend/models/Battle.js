const mongoose = require("mongoose");

const battleSchema = new mongoose.Schema({
    players: [
    {
        userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        },
        passedCount: { type: Number, default: 0 },
        lastSubmissionAt: Date,
    },
    ],

  problemId :{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
  },

  level: {
    type: Number,
    required: true,
  },

  question: {
    title: String,
    description: String,
    testCases: Array,
  },

  entryFee: {
    type: Number,
    default: 5,
  },

  totalPot: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: ["waiting", "active", "finished"],
    default: "waiting",
  },

  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  startedAt: Date,
  timeLimit: Number, // in seconds
});

module.exports = mongoose.model("Battle", battleSchema);
