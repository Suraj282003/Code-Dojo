const Battle = require("../models/Battle");
const Problem = require("../models/Problem");
const TestCase = require("../models/TestCase");
const User = require("../models/users");

async function getProblemForLevel(level) {
  // Example logic (you can improve later)
  if (level <= 2) {
    return await Problem.findOne({ difficulty: "Easy" });
  } else if (level <= 5) {
    return await Problem.findOne({ difficulty: "Medium" });
  } else {
    return await Problem.findOne({ difficulty: "Hard" });
  }
}

async function createBattle(user1, user2) {
  const entryFee = 5;

  // 🔒 Check coins BEFORE deducting
  if (user1.battleCoins < entryFee || user2.user.battleCoins < entryFee) {
    throw new Error("Not enough coins");
  }

  const problem = await getProblemForLevel(user1.level);
  if (!problem) {
  console.log("⚠ No problem found for difficulty");
  return null;
}
  const testCases = await TestCase.find({
    problemId: problem._id
  }).sort({ order: 1 });

  // 💰 Deduct coins AFTER validation
  await User.findByIdAndUpdate(user1._id, {
    $inc: { battleCoins: -entryFee }
  });

  await User.findByIdAndUpdate(user2.user._id, {
    $inc: { battleCoins: -entryFee }
  });

  const battle = await Battle.create({
    players: [
      { userId: user1._id, name: user1.name, passedCount: 0 },
      { userId: user2.user._id, name: user2.user.name, passedCount: 0 }
    ],
    problemId: problem._id,
    level: user1.level, // ✅ FIXED
    question: {
      title: problem.title,
      description: problem.description,
      testCases: testCases.filter(tc => !tc.isHidden)
    },
    timeLimit: 60,
    entryFee,
    totalPot: entryFee * 2,
    status: "active",
    startedAt: new Date()
  });

  return battle;
}


module.exports = { createBattle };
