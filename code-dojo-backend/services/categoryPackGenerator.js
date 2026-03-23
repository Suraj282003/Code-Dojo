const { generateStructuredProblem } = require("./aiProblemEngine");

function createFallback(level) {
  return {
    problem: {
      title: `Fallback ${level} Problem`,
      description: "Simple placeholder problem",
      difficulty: level,
      minRating: 800,
      maxRating: 1200,
      timeLimitMs: 2000,
      memoryLimitMb: 256,
      tags: ["fallback"]
    },
    testCases: [
      { input: "1", expectedOutput: "1", isHidden: false },
      { input: "2", expectedOutput: "2", isHidden: false },
      { input: "3", expectedOutput: "3", isHidden: true },
      { input: "4", expectedOutput: "4", isHidden: true }
    ]
  };
}

async function generateCategoryPack(categoryName) {
  const structure = [
    "Easy", "Easy", "Easy",
    "Medium", "Medium",
    "Hard", "Hard"
  ];

  const results = [];

  for (const level of structure) {
    try {
      const problem = await generateStructuredProblem(categoryName, level);

      if (!problem || !problem.problem || !problem.testCases) {
        throw new Error("Invalid AI output");
      }

      results.push(problem);
    } catch (err) {
      console.log("❌ Using fallback:", err.message);
      results.push(createFallback(level));
    }
  }

  return results;
}

module.exports = { generateCategoryPack };