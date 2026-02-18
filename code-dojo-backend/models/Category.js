const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Sorting, Searching, etc.
  },
  description: {
    type: String,
    default: "",
  },
  problems: [
    {
      problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
        required: true,
      },
      order: {
        type: Number,
        required: true,
      }
    }
  ],
  initialTime: {
    type: Number,
    default: 600, // seconds (10 minutes)
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Category", categorySchema)
