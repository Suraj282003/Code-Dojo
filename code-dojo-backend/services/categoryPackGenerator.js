const { generateStructuredProblem } = require("./aiProblemEngine");

async function generateCategoryPack(categoryName) {

  const structure = [
    "Easy",
    "Easy",
    "Easy",
    "Medium",
    "Medium",
    "Hard",
    "Hard"
  ];

  const problems = await Promise.all(
    structure.map(level =>
      generateStructuredProblem(categoryName, level)
    )
  );

  return problems;
}

module.exports = { generateCategoryPack };