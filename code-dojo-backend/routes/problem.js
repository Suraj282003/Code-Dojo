const express = require("express");
const router = express.Router();

const problemController = require("../controllers/problemController");
const Category = require("../models/Category");

const { generateStructuredProblem } = require("../services/aiProblemEngine");
const { saveGeneratedProblem } = require("../services/saveGeneratedProblem");
const { generateCategoryPack } = require("../services/categoryPackGenerator");

const { protect } = require("../Middleware/auth.middleware");
const adminOnly = require("../Middleware/AdminOnly.middleware");

// ==============================
// BASIC ROUTES
// ==============================
router.get("/", problemController.getAllProblems);
router.get("/:problemId", problemController.getProblemById);

// 🔐 Optional: protect this later
router.post("/", protect, adminOnly, problemController.createProblem);

// ==============================
// GENERATE SINGLE PROBLEM
// ==============================
router.post("/generate-test", protect, adminOnly, async (req, res) => {
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

    // 🔥 Generate + Save
    const aiData = await generateStructuredProblem(category, difficulty);
    const savedProblem = await saveGeneratedProblem(aiData, category);

    return res.status(201).json({
      success: true,
      message: "Problem generated and saved",
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
router.post("/generate-pack", protect, adminOnly, async (req, res) => {
  try {
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({
        error: "Category is required"
      });
    }

    const generatedProblems = await generateCategoryPack(category);

    const savedProblems = [];

    for (const data of generatedProblems) {
      try {
        const saved = await saveGeneratedProblem(data, category);

        savedProblems.push(saved._id);

      } catch (err) {
        console.error("❌ SAVE ERROR:", err.message);
      }
    }

    // ===============================
    // 🔥 UPDATE CATEGORY COLLECTION
    // ===============================

    let categoryDoc = await Category.findOne({ name: category });

    if (!categoryDoc) {
      categoryDoc = await Category.create({
        name: category,
        problems: []
      });
    }

    // Add problems with order
    const problemEntries = savedProblems.map((id, index) => ({
      problemId: id,
      order: index + 1
    }));

    categoryDoc.problems.push(...problemEntries);

    await categoryDoc.save();

    return res.status(201).json({
      success: true,
      message: "Category pack generated and saved",
      data: {
        totalGenerated: generatedProblems.length,
        totalSaved: savedProblems.length,
        categoryId: categoryDoc._id,
        problemIds: savedProblems
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