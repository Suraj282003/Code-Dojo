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
  usageCount: {
  type: Number,
  default: 0
  },
  lastUsedAt: {
    type: Date
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  tags: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


problemSchema.index({ minRating: 1, maxRating: 1 });
problemSchema.index({ isApproved: 1 });

module.exports = mongoose.model('Problem', problemSchema);
