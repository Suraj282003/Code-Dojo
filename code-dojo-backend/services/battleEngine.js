const Battle = require("../models/Battle");
const User = require("../models/users");
const { judgeSubmission } = require("./judgeService");
const { clearBattleTimeout } = require("./battleTimeoutManager");

// =======================
// SUBMIT BATTLE
// =======================
async function submitBattle({ battleId, userId, sourceCode, language }) {
  const battle = await Battle.findById(battleId);

  if (!battle || battle.status !== "active") {
    return { error: "Battle finished" };
  }

  // ⏳ Check timeout
  const now = Date.now();
  const endTime =
    new Date(battle.startedAt).getTime() + battle.timeLimit * 1000;

  if (now > endTime) {
    return await finishBattleByTimeout(battle);
  }

  // 🧪 Judge submission
  const result = await judgeSubmission({
    sourceCode,
    language,
    testCases: battle.question.testCases,
  });

  const passedCount = result.passedCount || 0;

  // 🔄 Update player's progress
  battle.players = battle.players.map((p) => {
    if (p.userId.toString() === userId.toString()) {
      p.passedCount = Math.max(p.passedCount, passedCount);
      p.lastSubmissionAt = new Date();
    }
    return p;
  });

  await battle.save();

  // 🏆 Instant full AC win
  if (result.verdict === "ACCEPTED") {
    return await finishBattleWithWinner(battle, userId);
  }

  return {
    verdict: result.verdict,
    passedCount,
  };
}

// =======================
// FINISH WITH WINNER
// =======================
async function finishBattleWithWinner(battle, userId) {
  const updated = await Battle.findOneAndUpdate(
    { _id: battle._id, status: "active" },
    { status: "finished", winner: userId },
    { new: true }
  );

  if (!updated) {
    return { verdict: "TOO_LATE" };
  }

  clearBattleTimeout(battle._id.toString());

  await rewardWinner(updated, userId);

  return {
    verdict: "WIN",
    winner: userId,
  };
}

// =======================
// FINISH BY TIMEOUT
// =======================
async function finishBattleByTimeout(battle) {
  if (battle.status === "finished") {
    return { error: "Already finished" };
  }

  const [p1, p2] = battle.players;

  let winnerId = null;

  if (p1.passedCount > p2.passedCount) {
    winnerId = p1.userId;
  } else if (p2.passedCount > p1.passedCount) {
    winnerId = p2.userId;
  } else if (p1.lastSubmissionAt && p2.lastSubmissionAt) {
    winnerId =
      p1.lastSubmissionAt < p2.lastSubmissionAt
        ? p1.userId
        : p2.userId;
  }

  if (!winnerId) {
    await refundCoins(battle);

    battle.status = "finished";
    await battle.save();

    clearBattleTimeout(battle._id.toString());

    return { verdict: "DRAW" };
  }

  return await finishBattleWithWinner(battle, winnerId);
}

// =======================
// REWARD WINNER
// =======================
async function rewardWinner(battle, winnerId) {
  const winner = await User.findById(winnerId);

  winner.battleCoins += battle.totalPot;
  winner.wins = (winner.wins || 0) + 1;

  if (winner.wins % 10 === 0) {
    winner.level += 1;
  }

  await winner.save();
}

// =======================
// REFUND COINS
// =======================
async function refundCoins(battle) {
  for (const p of battle.players) {
    const user = await User.findById(p.userId);
    user.battleCoins += battle.entryFee;
    await user.save();
  }
}

// =======================
// EXPORTS (CommonJS)
// =======================
module.exports = {
  submitBattle,
  finishBattleWithWinner,
  finishBattleByTimeout,
};
