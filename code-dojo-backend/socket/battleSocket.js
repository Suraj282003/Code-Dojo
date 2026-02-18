const { addToQueue, findOpponent, getQueue } = require("../services/matchmakingService");
const { createBattle } = require("../services/battleService");
const { submitBattle } = require("../services/battleEngine");
const { scheduleBattleTimeout } = require("../services/battleTimeoutManager");
const { finishBattleByTimeout } = require("../services/battleEngine");
const { finishBattleWithWinner } = require("../services/battleEngine");
const Battle = require("../models/Battle");
const Problem = require("../models/Problem");
const TestCase = require("../models/TestCase");
const User = require("../models/users");

const disconnectTimers = new Map(); // battleId_userId -> timeout

module.exports = function (io, socket) {

    socket.on("battle:find", async () => {
    const user = await User.findById(socket.user._id);

    if (user.battleCoins < 5) {
        return socket.emit("battle:error", "Not enough coins");
    }

    const opponent = findOpponent(user);

    if (!opponent) {
        addToQueue(user, socket);
        socket.emit("battle:waiting");
        return;
    }
    async function getProblemForLevel(level) {
    let difficulty = "Easy";

    if (level >= 5) difficulty = "Medium";
    if (level >= 10) difficulty = "Hard";

    let problem = await Problem.findOne({ difficulty });

    if (!problem) {
        // fallback to any problem
        problem = await Problem.findOne();
    }

    return problem;
    }

    const battle = await createBattle(user, opponent);

    socket.join(battle._id.toString());
    io.sockets.sockets.get(opponent.socketId)
        ?.join(battle._id.toString());

    scheduleBattleTimeout(io, battle, finishBattleByTimeout);

    Battle.findById(battle._id).lean();

    io.to(battle._id.toString()).emit("battle:start", Battle);
    });

    socket.on("battle:submit", async (data) => {
    const result = await submitBattle({
        battleId: data.battleId,
        userId: socket.user._id,
        sourceCode: data.sourceCode,
        language: data.language,
    });

    if (result.verdict === "WIN" || result.verdict === "DRAW") {
    io.to(data.battleId).emit("battle:ended", result);
    } else {
    io.to(data.battleId).emit("battle:update", {
        userId: socket.user._id.toString(),
        passedCount: result.passedCount
    });
    }
    });


    socket.on("disconnect", async () => {
    const userId = socket.user._id;

    // Remove from queue
    const queue = getQueue();
    for (const [level, arr] of queue.entries()) {
        const index = arr.findIndex(
        (entry) => entry.user._id.toString() === userId.toString()
        );
        if (index !== -1) {
        arr.splice(index, 1);
        }
    }

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


    socket.on("battle:reconnect", async ({ battleId }) => {
    const battle = await Battle.findById(battleId);

    if (!battle) return;

    socket.join(battleId);

    if (battle.status === "finished") {
        socket.emit("battle:ended", {
        winner: battle.winner
        });
        return;
    }

    socket.emit("battle:resume", battle);
    });



};
