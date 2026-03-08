const { generateCategoryPackFromAI } = require("./aiProblemEngine");
const { saveGeneratedProblem } = require("./problemSaver");
const Category = require("../models/Category");
const Problem = require("../models/Problem");

async function generateCategoryPack(categoryName) {

  const existingCategory = await Category.findOne({ name: categoryName });

  if (existingCategory && existingCategory.problems?.length >= 7) {
    throw new Error("Category already has enough problems");
  }

  console.log(`Generating FULL pack for ${categoryName}...`);

  const aiData = await generateCategoryPackFromAI(categoryName);

  const createdProblems = [];

  for (let item of aiData.problems) {

    try {

      const exists = await Problem.findOne({
        title: item.problem.title,
        difficulty: item.problem.difficulty
      });

      if (exists) {
        console.log("Duplicate skipped:", item.problem.title);
        continue;
      }

      const saved = await saveGeneratedProblem(item, categoryName);

      if (saved) createdProblems.push(saved._id);

    } catch (err) {

      console.log("Skipped invalid problem:", err.message);
      continue;

    }
  }

  if (createdProblems.length === 0) {
    throw new Error("No valid problems generated");
  }

  // ===============================
  // CREATE OR UPDATE CATEGORY
  // ===============================

  if (!existingCategory) {

    await Category.create({
      name: categoryName,
      initialTime: aiData.initialTime,
      problems: createdProblems
    });

  } else {

    existingCategory.initialTime = aiData.initialTime;

    existingCategory.problems = [
      ...(existingCategory.problems || []),
      ...createdProblems
    ];

    await existingCategory.save();
  }

  return createdProblems;
}

module.exports = { generateCategoryPack };