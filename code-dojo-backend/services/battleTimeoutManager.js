const Battle = require("../models/Battle");

const activeTimeouts = new Map(); // battleId -> timeoutId

function scheduleBattleTimeout(io, battle, finishFn) {
  const battleId = battle._id.toString();

  const remainingTime =
    new Date(battle.startedAt).getTime() +
    battle.timeLimit * 1000 -
    Date.now();

  if (remainingTime <= 0) {
    triggerTimeout(io, battleId, finishFn);
    return;
  }

  const timeoutId = setTimeout(() => {
    triggerTimeout(io, battleId, finishFn);
  }, remainingTime);

  activeTimeouts.set(battleId, timeoutId);
}

async function triggerTimeout(io, battleId, finishFn) {
  const battle = await Battle.findById(battleId);
  if (!battle || battle.status === "finished") return;

  const result = await finishFn(battle);

  io.to(battleId).emit("battle:ended", result);

  clearBattleTimeout(battleId);
}

function clearBattleTimeout(battleId) {
  if (activeTimeouts.has(battleId)) {
    clearTimeout(activeTimeouts.get(battleId));
    activeTimeouts.delete(battleId);
  }
}

module.exports = {
  scheduleBattleTimeout,
  clearBattleTimeout,
};
