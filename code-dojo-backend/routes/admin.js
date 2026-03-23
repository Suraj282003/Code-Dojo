const express = require("express");
const router = express.Router();

const { protect } = require("../Middleware/auth.middleware");
const adminOnly = require("../Middleware/AdminOnly.middleware");

const { generateCategoryPack } = require("../services/categoryPackGenerator");
const { saveGeneratedProblem } = require("../services/saveGeneratedProblem");

const Category = require("../models/Category");

// ==============================
// ADMIN GENERATE CATEGORY
// ==============================
router.post("/generate-category", protect, adminOnly, async (req, res) => {
  try {
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required"
      });
    }

    const generatedProblems = await generateCategoryPack(category);

    const savedProblems = [];

    for (const data of generatedProblems) {
      try {
        const saved = await saveGeneratedProblem(data, category);

        savedProblems.push({
          id: saved._id,
          title: saved.title,
          difficulty: saved.difficulty
        });

      } catch (err) {
        console.log("⚠️ Skipped:", err.message);
      }
    }

    // 🔥 LINK TO CATEGORY
    let categoryDoc = await Category.findOne({ name: category });

    if (!categoryDoc) {
      categoryDoc = await Category.create({
        name: category,
        problems: []
      });
    }

    const entries = savedProblems.map((p, index) => ({
      problemId: p.id,
      order: index + 1
    }));

    categoryDoc.problems.push(...entries);
    await categoryDoc.save();

    return res.json({
      success: true,
      message: "Problems generated successfully",
      problems: savedProblems
    });

  } catch (err) {
    console.error("ADMIN ERROR:", err.message);

    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;