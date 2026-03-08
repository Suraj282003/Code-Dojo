const express = require('express');
const router = express.Router();
const problemController = require('../controllers/problemController');
const { generateStructuredProblem } = require("../services/aiProblemEngine");
const { saveGeneratedProblem } = require("../services/problemSaver");
const { generateCategoryPack } = require("../services/categoryPackGenerator");

router.get('/', problemController.getAllProblems);
router.get('/:problemId', problemController.getProblemById);
router.post('/', problemController.createProblem); // admin only

router.post("/generate-test", async (req, res) => {
  try {

    const { category, difficulty } = req.body;

    if (!category || !difficulty) {
      return res.status(400).json({
        error: "Category and difficulty are required"
      });
    }

    const allowed = ["Easy", "Medium", "Hard"];

    if (!allowed.includes(difficulty)) {
      return res.status(400).json({
        error: "Difficulty must be Easy, Medium, or Hard"
      });
    }

    const aiData = await generateStructuredProblem(category, difficulty);

    const savedProblem = await saveGeneratedProblem(aiData, category);

    return res.status(201).json({
      success: true,
      message: "Problem generated successfully",
      data: {
        problemId: savedProblem._id,
        title: savedProblem.title
      }
    });

  } catch (error) {

    console.error("AI Problem Generation Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


// ==============================
// GENERATE FULL CATEGORY PACK
// ==============================
router.post("/generate-pack", async (req, res) => {

  try {

    const { category } = req.body;

    if (!category) {
      return res.status(400).json({
        error: "Category is required"
      });
    }

    const problems = await generateCategoryPack(category);

    return res.status(201).json({
      success: true,
      message: "Category pack generated successfully",
      data: {
        totalProblems: problems.length,
        problemIds: problems
      }
    });

  } catch (error) {

    console.error("AI Pack Generation Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message
    });

  }
});

module.exports = router;
