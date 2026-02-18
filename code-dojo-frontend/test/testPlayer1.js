const { io } = require("socket.io-client");

const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OGMyZjBlNWZjZWIxOGM5NjMzZTI3MiIsImp0aSI6IjE2ZmZmZWU3LTk0NTktNGRjZS1iMTFlLWIxMTE3ZmIzZjZhYSIsImlhdCI6MTc3MDg3NzAyOCwiZXhwIjoxNzcwODgwNjI4fQ.epq0emtMGPQk6KphkW6v7Qm4iakpsaZNs_fmjIrOVY8";

const socket = io("http://localhost:5000", {
  auth: {
    token: ACCESS_TOKEN,
    transports: ["websocket"],     // 🔥 force websocket
  reconnection: false,  
  },
});

socket.on("connect", () => {
  console.log("🟢 Player1 Connected:", socket.id);

  socket.emit("battle:find");
});

socket.on("battle:waiting", () => {
  console.log("⏳ Player1 waiting for opponent...");
});

socket.on("battle:start", (battle) => {
  console.log("🔥 Player1 Battle Started:", battle._id);

  // Submit correct solution after 2 seconds
  setTimeout(() => {
    console.log("📤 Player1 submitting...");

    socket.emit("battle:submit", {
      battleId: battle._id,
      language: "javascript",
      sourceCode: `
        const fs = require('fs');
        const input = fs.readFileSync(0,'utf8').trim().split(' ');
        console.log(Number(input[0]) + Number(input[1]));
      `,
    });
  }, 2000);
});

socket.on("battle:update", (data) => {
  console.log("📊 Player1 Update:", data);
});

socket.on("battle:ended", (data) => {
  console.log("🏆 Player1 Battle Ended:", data);
});

socket.on("disconnect", () => {
  console.log("🔴 Player1 Disconnected");
});

socket.on("connect_error", (err) => {
  console.log("❌ Connection Error:", err.message);
});

socket.on("error", (err) => {
  console.log("❌ Socket Error:", err);
});