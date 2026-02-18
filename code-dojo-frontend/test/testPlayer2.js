const { io } = require("socket.io-client");

const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OGMyZmY0NWZjZWIxOGM5NjMzZTJhMyIsImp0aSI6IjkzYWFkZjEyLWNiNDktNGY3Zi05NDRiLTgwMGYzMDE4ZmY0ZiIsImlhdCI6MTc3MDg3NzA1NiwiZXhwIjoxNzcwODgwNjU2fQ.DXZuNoqi3IvucwHfWASKbcEzV7MjqEjIzah1dHNmxe8";

const socket = io("http://localhost:5000", {
  auth: {
    token: ACCESS_TOKEN,
    transports: ["websocket"],     // 🔥 force websocket
  reconnection: false,  
  },
});

socket.on("connect", () => {
  console.log("🟢 Player2 Connected:", socket.id);

  socket.emit("battle:find");
});

socket.on("battle:waiting", () => {
  console.log("⏳ Player2 waiting for opponent...");
});

socket.on("battle:start", (battle) => {
  console.log("🔥 Player2 Battle Started:", battle._id);

  // Submit WRONG solution after 4 seconds
  setTimeout(() => {
    console.log("📤 Player2 submitting WRONG answer...");

    socket.emit("battle:submit", {
      battleId: battle._id,
      language: "javascript",
      sourceCode: `
        console.log("wrong answer");
      `,
    });
  }, 4000);
});

socket.on("battle:update", (data) => {
  console.log("📊 Player2 Update:", data);
});

socket.on("battle:ended", (data) => {
  console.log("🏆 Player2 Battle Ended:", data);
});

socket.on("disconnect", () => {
  console.log("🔴 Player2 Disconnected");
});

socket.on("connect_error", (err) => {
  console.log("❌ Connection Error:", err.message);
});

socket.on("error", (err) => {
  console.log("❌ Socket Error:", err);
});