const User = require("../models/users");
const { addToQueue, findOpponent } = require("../services/matchmakingService");
const { createBattle } = require("../services/battleService");

exports.findBattle = async (req, res) => {
  const user = await User.findById(req.user.id);

  const opponent = findOpponent(user);

  if (!opponent) {
    addToQueue(user);
    return res.json({ message: "Waiting for opponent..." });
  }

  // TODO: Fetch question from DB
  // const question = {
  //   title: "Sum of Two Numbers",
  //   description: "Take two integers and print sum",
  //   testCases: [
  //     { input: "2 3", expectedOutput: "5" },
  //     { input: "5 7", expectedOutput: "12" },
  //   ],
  // };

  const battle = await createBattle(user, opponent, question);

  res.json({
    message: "Battle created",
    battleId: battle._id,
  });
};
