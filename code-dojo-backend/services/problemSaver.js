const Problem = require("../models/Problem");
const TestCase = require("../models/TestCase");

async function saveGeneratedProblem(data, categoryName) {

  const problem = await Problem.create({
    ...data.problem,
    supportedLanguages: ["javascript", "java", "python", "cpp"],
    usageCount: 0,
    isApproved: true
  });

  for (let tc of data.testCases) {
    await TestCase.create({
      problemId: problem._id,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      isHidden: tc.isHidden
    });
  }

  return problem;
}

module.exports = { saveGeneratedProblem };