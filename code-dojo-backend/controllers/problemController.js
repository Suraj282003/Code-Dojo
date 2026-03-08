const Problem = require('../models/Problem');
const TestCase = require('../models/TestCase');
const { generateStructuredProblem } = require("../services/aiProblemEngine");
const Category = require("../models/Category");


// Get all problems
exports.getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find().select('-description'); // Don't send full description yet
    res.status(200).json(problems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single problem with testcases (sample only)
exports.getProblemById = async (req, res) => {
  try {
    const { problemId } = req.params;
    const problem = await Problem.findById(problemId);
    const testCases = await TestCase.find({ problemId, isHidden: false });

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    res.status(200).json({
      ...problem.toObject(),
      sampleTestCases: testCases,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create problem (admin only)
exports.createProblem = async (req, res) => {
  try {
    const { title, description, difficulty, timeLimitMs, memoryLimitMb, testCases, minRating, maxRating } = req.body;

    const problem = new Problem({
      title,
      description,
      difficulty,
      timeLimitMs,
      memoryLimitMb,
      minRating,
      maxRating,

    });

    await problem.save();

    // Create testcases
    if (testCases && testCases.length > 0) {
      const testCaseRecords = testCases.map((tc, idx) => ({
        problemId: problem._id,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        isHidden: tc.isHidden || false,
        order: idx,
      }));
      await TestCase.insertMany(testCaseRecords);
    }

    res.status(201).json(problem);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

