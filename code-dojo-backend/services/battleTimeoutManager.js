const Battle = require("../models/Battle");

const activeTimeouts = new Map(); // battleId -> timeoutId



// ========================================
// SCHEDULE TIMEOUT
// ========================================
function scheduleBattleTimeout(io, battle, finishFn) {
  if (!battle || !battle._id) return;

  const battleId = battle._id.toString();

  // Prevent duplicate scheduling
  if (activeTimeouts.has(battleId)) {
    return;
  }

  const endTime =
    new Date(battle.startedAt).getTime() +
    battle.timeLimit * 1000;

  const remainingTime = endTime - Date.now();

  if (remainingTime <= 0) {
    triggerTimeout(io, battleId, finishFn);
    return;
  }

  console.log(`⏳ Scheduling timeout for battle ${battleId} in ${remainingTime}ms`);

  const timeoutId = setTimeout(() => {
    triggerTimeout(io, battleId, finishFn);
  }, remainingTime);

  activeTimeouts.set(battleId, timeoutId);
}



// ========================================
// TRIGGER TIMEOUT
// ========================================
async function triggerTimeout(io, battleId, finishFn) {

  const battle = await Battle.findById(battleId);

  if (!battle) {
    clearBattleTimeout(battleId);
    return;
  }

  if (battle.status === "finished") {
    clearBattleTimeout(battleId);
    return;
  }

  console.log(`⌛ Timeout triggered for battle ${battleId}`);

  try {
    const result = await finishFn(battle);

    io.to(battleId).emit("battle:ended", result);

  } catch (err) {
    console.error("Timeout finish error:", err);
  }

  clearBattleTimeout(battleId);
}



// ========================================
// CLEAR TIMEOUT
// ========================================
function clearBattleTimeout(battleId) {
  if (!battleId) return;

  if (activeTimeouts.has(battleId)) {
    clearTimeout(activeTimeouts.get(battleId));
    activeTimeouts.delete(battleId);
    console.log(`🧹 Cleared timeout for battle ${battleId}`);
  }
}



// ========================================
// RECOVER ACTIVE BATTLES (IMPORTANT)
// Call this on server startup
// ========================================
async function recoverActiveBattles(io, finishFn) {
  const activeBattles = await Battle.find({
    status: "active"
  });

  for (const battle of activeBattles) {
    scheduleBattleTimeout(io, battle, finishFn);
  }

  console.log(`♻ Recovered ${activeBattles.length} active battles`);
}



module.exports = {
  scheduleBattleTimeout,
  clearBattleTimeout,
  recoverActiveBattles
};
