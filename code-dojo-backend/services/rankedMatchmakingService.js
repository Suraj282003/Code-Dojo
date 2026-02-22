const rankedQueue = [];

function addToRankedQueue(user, socket) {
  rankedQueue.push({
    user,
    socketId: socket.id,
  });
}

function removeFromQueue(userId) {
  const index = rankedQueue.findIndex(
    (u) => u.user._id.toString() === userId.toString()
  );
  if (index !== -1) rankedQueue.splice(index, 1);
}

function findRankedOpponent(user) {
  const range = 150;

  const index = rankedQueue.findIndex(entry =>
    entry.user._id.toString() !== user._id.toString() &&
    Math.abs(entry.user.rating - user.rating) <= range
  );

  if (index === -1) return null;

  const opponent = rankedQueue[index];
  rankedQueue.splice(index, 1);

  console.log("Queue:", rankedQueue.map(u => ({
  id: u.user._id,
  rating: u.user.rating
})));

  return opponent;
}

module.exports = {
  addToRankedQueue,
  findRankedOpponent,
  removeFromQueue
};
