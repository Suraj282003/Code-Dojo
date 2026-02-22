const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy',
  },

  minRating: {
    type: Number,
    required: true,
    default: 0
  },

  maxRating: {
    type: Number,
    required: true,
    default: 3000
  },

  timeLimitMs: {
    type: Number,
    default: 2000, // 2 seconds
  },
  memoryLimitMb: {
    type: Number,
    default: 256,
  },
  supportedLanguages: {
    type: [String],
    default: ['c++', 'java', 'javascript', 'python3'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Problem', problemSchema);
