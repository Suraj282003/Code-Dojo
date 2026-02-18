const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://host.docker.internal:6379",
});

redisClient.on("connect", () => {
  console.log("✅ Redis Connected");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis Error", err);
});

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error("❌ Redis connection failed", err);
  }
})();

module.exports = redisClient;
