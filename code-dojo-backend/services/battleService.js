const Battle = require("../models/Battle");
const Problem = require("../models/Problem");
const TestCase = require("../models/TestCase");
const User = require("../models/users");


// ========================================
// GET PROBLEM BASED ON RATING
// ========================================
async function getProblemForRating(rating) {
  const cooldownMinutes = 10;
  const cutoff = new Date(Date.now() - cooldownMinutes * 60 * 1000);

  let problems = await Problem.aggregate([
    {
      $match: {
        minRating: { $lte: rating + 100 }, // allow some flexibility
        maxRating: { $gte: rating - 100},
        isApproved: true,
        $or: [
          { lastUsedAt: { $exists: false } },
          { lastUsedAt: { $lt: cutoff } }
        ]
      }
    },
    {
      $addFields: {
        usageCount: { $ifNull: ["$usageCount", 0] }
      }
    },
    {
      $sort: { usageCount: 1 }
    },
    { $limit: 20 },          // Take top 20 least used
    { $sample: { size: 1 } } // Random among them
  ]);

  // Fallback if nothing found (small pool case)
  if (!problems.length) {
    problems = await Problem.aggregate([
      {
        $match: {
          minRating: { $lte: rating },
          maxRating: { $gte: rating },
          isApproved: true
        }
      },
      { $sample: { size: 1 } }
    ]);
  }

  return problems[0] || null;
}

// ========================================
// CREATE RANKED BATTLE
// ========================================
async function createBattle(user1, user2) {

  // Always refetch fresh user data
  const player1 = await User.findById(user1._id);
  const player2 = await User.findById(user2._id);

  if (!player1 || !player2) {
    throw new Error("User not found");
  }

  // Get problem based on rating (average rating)
  const avgRating = Math.round(
    (player1.rating + player2.rating) / 2
  );

  

  const problem = await getProblemForRating(avgRating);

  if (!problem) {
    console.log("⚠ No problem found for rating:", avgRating);
    throw new Error("No problem found for rating");
  }

  const testCases = await TestCase.find({
    problemId: problem._id
  }).sort({ order: 1 });

  if (!testCases.length) {
    throw new Error("No testcases found for problem");
  }

  const battle = await Battle.create({
    type: "ranked", // new field recommended

    players: [
      {
        userId: player1._id,
        name: player1.name,
        ratingSnapshot: player1.rating,
        passedCount: 0
      },
      {
        userId: player2._id,
        name: player2.name,
        ratingSnapshot: player2.rating,
        passedCount: 0
      }
    ],

    problemId: problem._id,

    question: {
      title: problem.title,
      description: problem.description,
      testCases: testCases.filter(tc => !tc.isHidden)
    },

    timeLimit: 90, // ranked longer time
    status: "active",
    startedAt: new Date()
  });

  return battle;
}


module.exports = { createBattle };
