const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  userId: {
    type: String, // or ObjectId if you have user auth
    // required: true,
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
  },
  language: {
    type: String,
    required: true,
    enum: ['cpp', 'java', 'javascript', 'python3'],
  },
  sourceCode: {
    type: String,
    required: true, // YES, SAVE THE CODE
  },
  status: {
    type: String,
    enum: ['QUEUED', 'RUNNING', 'ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT', 'RUNTIME_ERROR', 'COMPILATION_ERROR'],
    default: 'QUEUED',
  },
  verdict: {
    type: String,
    default: null,
  },
  testResults: [{
    testCaseId: mongoose.Schema.Types.ObjectId,
    passed: Boolean,
    runtime: Number, // milliseconds
    memory: Number, // MB
    output: String,
    expectedOutput: String,
  }],
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model('Submission', submissionSchema);
