const {
  addToRankedQueue,
  findRankedOpponent,
  removeFromQueue
} = require("../services/rankedMatchmakingService");

const { createBattle } = require("../services/battleService");
const {
  submitBattle,
  finishBattleWithWinner,
  finishBattleByTimeout
} = require("../services/battleEngine");

const { scheduleBattleTimeout } = require("../services/battleTimeoutManager");

const Battle = require("../models/Battle");
const User = require("../models/users");

const disconnectTimers = new Map();

module.exports = function (io, socket) {

  // ===============================
  // FIND RANKED MATCH
  // ===============================
  socket.on("battle:find", async () => {
    const user = await User.findById(socket.user._id);

    if (!user) return;

    const opponent = findRankedOpponent(user);

    if (!opponent) {
      addToRankedQueue(user, socket);
      socket.emit("battle:waiting");
      return;
    }

    const battle = await createBattle(user, opponent.user);

    socket.join(battle._id.toString());
    io.sockets.sockets
      .get(opponent.socketId)
      ?.join(battle._id.toString());

    scheduleBattleTimeout(io, battle, finishBattleByTimeout);

    io.to(battle._id.toString()).emit("battle:start", battle);
  });


  // ===============================
  // SUBMIT
  // ===============================
  socket.on("battle:submit", async (data) => {
    const result = await submitBattle({
      battleId: data.battleId,
      userId: socket.user._id,
      sourceCode: data.sourceCode,
      language: data.language,
    });

    if (!result) return;

    if (result.verdict === "WIN" || result.verdict === "DRAW") {
      io.to(data.battleId).emit("battle:ended", result);
    } else {
      io.to(data.battleId).emit("battle:update", {
        userId: socket.user._id.toString(),
        passedCount: result.passedCount,
        results: result.results,
        error: result.error,
      });
    }
  });


  // ===============================
  // DISCONNECT (20 sec grace)
  // ===============================
  socket.on("disconnect", async () => {
    const userId = socket.user?._id;
    if (!userId) return;

    removeFromQueue(userId);

    const activeBattle = await Battle.findOne({
      status: "active",
      "players.userId": userId,
    });

    if (!activeBattle) return;

    const battleId = activeBattle._id.toString();
    const key = `${battleId}_${userId}`;

    const timer = setTimeout(async () => {
      const opponent = activeBattle.players.find(
        (p) => p.userId.toString() !== userId.toString()
      );

      if (!opponent) return;

      const result = await finishBattleWithWinner(
        activeBattle,
        opponent.userId
      );

      io.to(battleId).emit("battle:ended", {
        ...result,
        reason: "DISCONNECT_TIMEOUT",
      });

      disconnectTimers.delete(key);
    }, 20000);

    disconnectTimers.set(key, timer);
  });


  // ===============================
  // RECONNECT
  // ===============================
socket.on("battle:reconnect", async ({ battleId }) => {
  const battle = await Battle.findById(battleId);
  if (!battle) return;

  const userId = socket.user?._id?.toString();
  const key = `${battleId}_${userId}`;

  if (disconnectTimers.has(key)) {
    clearTimeout(disconnectTimers.get(key));
    disconnectTimers.delete(key);
    console.log("🟢 Disconnect timer cleared for", userId);
  }

  socket.join(battleId);

  if (battle.status === "finished") {
    socket.emit("battle:ended", {
      winner: battle.winner,
    });
    return;
  }

  socket.emit("battle:resume", battle);
});

};
