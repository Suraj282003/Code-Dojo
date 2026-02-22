const Battle = require("../models/Battle");
const User = require("../models/users");
const { judgeSubmission } = require("./judgeService");
const { clearBattleTimeout } = require("./battleTimeoutManager");
const TestCase = require("../models/TestCase");


// ======================================
// ELO CALCULATION
// ======================================
function calculateNewRating(playerRating, opponentRating, actualScore) {
  const K = 32;

  const expectedScore =
    1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));

  return Math.round(
    playerRating + K * (actualScore - expectedScore)
  );
}


// ======================================
// SUBMIT BATTLE
// ======================================
async function submitBattle({ battleId, userId, sourceCode, language }) {
  const battle = await Battle.findById(battleId);

  if (!battle || battle.status !== "active") {
    return { error: "Battle finished" };
  }

  const now = Date.now();
  const endTime =
    new Date(battle.startedAt).getTime() +
    battle.timeLimit * 1000;

  // If time over → decide winner
  if (now > endTime) {
    return await finishBattleByTimeout(battle);
  }

  // 🔥 IMPORTANT: Fetch ALL testcases (hidden + visible)
  const testCases = await TestCase.find({
    problemId: battle.problemId
  }).sort({ order: 1 });

  const result = await judgeSubmission({
    sourceCode,
    language,
    testCases
  });

  const passedCount = result.passedCount || 0;

  // Update progress
  battle.players.forEach((p) => {
    if (p.userId.toString() === userId.toString()) {
      p.passedCount = Math.max(p.passedCount, passedCount);
      p.lastSubmissionAt = new Date();
    }
  });

  await battle.save();

  // 🔥 INSTANT WIN MODE
  if (result.verdict === "ACCEPTED") {
    return await finishBattleWithWinner(battle, userId);
  }
    return {
      verdict: result.verdict,
      passedCount,
      results: result.results,
      error:
        result.verdict === "COMPILE_ERROR" ||
        result.verdict === "RUNTIME_ERROR"
          ? result.error
          : null
    };
  }

// ======================================
// FINISH WITH WINNER (ELO UPDATE)
// ======================================
async function finishBattleWithWinner(battle, winnerId) {

  const updated = await Battle.findOneAndUpdate(
    { _id: battle._id, status: "active" },
    { status: "finished", winner: winnerId },
    { new: true }
  );

  if (!updated) {
    return { verdict: "TOO_LATE" };
  }

  clearBattleTimeout(battle._id.toString());

  const [p1, p2] = updated.players;

  const player1 = await User.findById(p1.userId);
  const player2 = await User.findById(p2.userId);

  let winner, loser;

  if (winnerId.toString() === p1.userId.toString()) {
    winner = player1;
    loser = player2;
  } else {
    winner = player2;
    loser = player1;
  }

  const winnerOldRating = winner.rating;
const loserOldRating = loser.rating;

const winnerNewRating = calculateNewRating(
  winnerOldRating,
  loserOldRating,
  1
);

const loserNewRating = calculateNewRating(
  loserOldRating,
  winnerOldRating,
  0
);

winner.rating = winnerNewRating;
loser.rating = loserNewRating;

  winner.wins = (winner.wins || 0) + 1;
  loser.losses = (loser.losses || 0) + 1;

  await winner.save();
  await loser.save();
  return {
    verdict: "WIN",
    winner: winnerId.toString(),
    ratingChange: {
      winner: winnerNewRating - winnerOldRating,
      loser: loserNewRating - loserOldRating
    }
  };
}


// ======================================
// FINISH BY TIMEOUT
// ======================================
async function finishBattleByTimeout(battle) {

  if (battle.status === "finished") {
    return { error: "Already finished" };
  }

  const [p1, p2] = battle.players;

  let winnerId = null;

  // If both never submitted → DRAW
  if (!p1.lastSubmissionAt && !p2.lastSubmissionAt) {
    return await finishBattleDraw(battle);
  }

  if (p1.passedCount > p2.passedCount) {
    winnerId = p1.userId;

  } else if (p2.passedCount > p1.passedCount) {
    winnerId = p2.userId;

  } else if (p1.lastSubmissionAt && !p2.lastSubmissionAt) {
    winnerId = p1.userId;

  } else if (!p1.lastSubmissionAt && p2.lastSubmissionAt) {
    winnerId = p2.userId;

  } else if (p1.lastSubmissionAt && p2.lastSubmissionAt) {
    winnerId =
      p1.lastSubmissionAt < p2.lastSubmissionAt
        ? p1.userId
        : p2.userId;
  }

  if (!winnerId) {
    return await finishBattleDraw(battle);
  }

  return await finishBattleWithWinner(battle, winnerId);
}

// ======================================
// DRAW HANDLING (ELO HALF SCORE)
// ======================================
async function finishBattleDraw(battle) {

  const updated = await Battle.findOneAndUpdate(
    { _id: battle._id, status: "active" },
    { status: "finished" },
    { new: true }
  );

  clearBattleTimeout(battle._id.toString());

  const [p1, p2] = updated.players;

  const player1 = await User.findById(p1.userId);
  const player2 = await User.findById(p2.userId);

  const p1NewRating = calculateNewRating(
    player1.rating,
    player2.rating,
    0.5
  );

  const p2NewRating = calculateNewRating(
    player2.rating,
    player1.rating,
    0.5
  );

  player1.rating = p1NewRating;
  player2.rating = p2NewRating;

  await player1.save();
  await player2.save();

  return {
    verdict: "DRAW",
    winner: null,
    ratingChange: {
      player1: p1NewRating,
      player2: p2NewRating
    }
  };
}


// ======================================
module.exports = {
  submitBattle,
  finishBattleWithWinner,
  finishBattleByTimeout,
};
