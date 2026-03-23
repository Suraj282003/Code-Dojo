const mongoose = require("mongoose");
const Problem = require("../models/Problem");
const TestCase = require("../models/TestCase");

// =======================
// VALIDATION
// =======================
function validateBeforeSave(data) {
  if (!data || !data.problem) return false;

  const p = data.problem;
  const t = data.testCases;

  if (!p.title || !p.description) return false;
  if (!Array.isArray(t) || t.length !== 4) return false;

  return true;
}

// =======================
// SAVE FUNCTION
// =======================
async function saveGeneratedProblem(data, categoryName) {
  if (!data || !data.problem) {
    throw new Error("Invalid data");
  }

  const problem = await Problem.create({
    ...data.problem,
    category: categoryName,
    supportedLanguages: ["javascript", "java", "python", "cpp"],
    usageCount: 0,
    isApproved: true
  });

  const testCases = data.testCases.map(tc => ({
    problemId: problem._id,
    input: tc.input,
    expectedOutput: tc.expectedOutput,
    isHidden: tc.isHidden
  }));

  await TestCase.insertMany(testCases);

  return problem;
}

module.exports = { saveGeneratedProblem };