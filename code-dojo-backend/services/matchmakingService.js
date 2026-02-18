const queue = new Map(); // level -> array

function getQueue() {
  return queue;
}

function addToQueue(user, socket) {
  if (!queue.has(user.level)) {
    queue.set(user.level, []);
  }

  // Prevent duplicate entries
  const levelQueue = queue.get(user.level);

  const alreadyExists = levelQueue.some(
    (entry) => entry.user._id.toString() === user._id.toString()
  );

  if (!alreadyExists) {
    levelQueue.push({
      user,
      socketId: socket.id,
    });
  }
}

function findOpponent(user) {
  const levelQueue = queue.get(user.level);
  if (!levelQueue) return null;

  const index = levelQueue.findIndex(
    (entry) => entry.user._id.toString() !== user._id.toString()
  );

  if (index === -1) return null;

  const opponent = levelQueue[index];

  // Remove opponent
  levelQueue.splice(index, 1);

  // Remove current user if exists
  const selfIndex = levelQueue.findIndex(
    (entry) => entry.user._id.toString() === user._id.toString()
  );

  if (selfIndex !== -1) {
    levelQueue.splice(selfIndex, 1);
  }

  return opponent;
}

module.exports = { addToQueue, findOpponent, getQueue };
