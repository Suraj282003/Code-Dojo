const express = require("express");
const router = express.Router();

const { protect } = require("../Middleware/auth.middleware");
const adminOnly = require("../Middleware/AdminOnly.middleware");

const { generateCategoryPack } = require("../services/categoryPackGenerator");
const { saveGeneratedProblem } = require("../services/saveGeneratedProblem");

const User = require("../models/users");
const Problem = require("../models/Problem");
const Category = require("../models/Category");
const Battle = require("../models/Battle");
const TestCase = require("../models/TestCase");

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

        const testCases = await TestCase.find({ problemId: saved._id });

        savedProblems.push({
          id: saved._id,
          title: saved.title,
          description: saved.description,
          difficulty: saved.difficulty,
          tags: saved.tags,
          testCases
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

// ==========================
// DASHBOARD STATS
// ==========================
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.countDocuments();
    const problems = await Problem.countDocuments();
    const categories = await Category.countDocuments();
    const matches = await Battle.countDocuments();

    res.json({
      success: true,
      data: { users, problems, categories, matches }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================
// ALL PROBLEMS
// ==========================
router.get("/problems", protect, adminOnly, async (req, res) => {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 });

    res.json({ success: true, data: problems });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// ==========================
// GET PROBLEM DETAILS
// ==========================
router.get("/problem/:id", protect, adminOnly, async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    const testCases = await TestCase.find({ problemId: req.params.id });

    res.json({
      success: true,
      data: { problem, testCases }
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// ==========================
// UPDATE PROBLEM
// ==========================
router.put("/problem/:id", protect, adminOnly, async (req, res) => {
  try {
    const { title, description, difficulty, tags } = req.body;

    const updated = await Problem.findByIdAndUpdate(
      req.params.id,
      { title, description, difficulty, tags },
      { new: true }
    );

    res.json({
      success: true,
      data: updated
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================
// DELETE PROBLEM
// ==========================
router.delete("/problem/:id", protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    await Problem.findByIdAndDelete(id);
    await TestCase.deleteMany({ problemId: id });

    await Category.updateMany(
      {},
      { $pull: { problems: { problemId: id } } }
    );

    res.json({
      success: true,
      message: "Problem deleted successfully"
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});


// ==========================
// ALL CATEGORIES WITH PROBLEMS
// ==========================
router.get("/categories", protect, adminOnly, async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("problems.problemId");

    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// ==========================
// GET ALL USERS (ADMIN)
// ==========================
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select(
      "name email rating rank wins losses draws totalMatches createdAt"
    ).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users
    });

  } catch (err) {
    console.error("USERS ERROR:", err.message);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


module.exports = router;