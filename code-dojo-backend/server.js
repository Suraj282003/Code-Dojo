require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require("./routes/user.routes");
const problemRoutes = require('./routes/problem');
const authRoutes = require('./routes/auth.routes.js');
const submissionRoutes = require('./routes/submission'); // Add this
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const socketAuth = require("./socket/socketAuth");
const battleSocket = require("./socket/battleSocket");
const Battle = require("./models/Battle");
const { recoverActiveBattles } = require("./services/battleTimeoutManager");
const { finishBattleByTimeout } = require("./services/battleEngine");
const adminRoutes = require("./routes/admin");


const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // 👈 your frontend URL
    credentials: true,               // 👈 REQUIRED for cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Connect Database
connectDB();


// Routes
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/run', require('./routes/run'));
app.use("/api/categories", require("./routes/category"));
app.use("/api/challenge", require("./routes/challenge"));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);


// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Code Dojo Backend API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });

io.use(socketAuth);

io.on("connection", (socket) => {
  battleSocket(io, socket);
  console.log("⚡ New socket connected:", socket.id);
});

recoverActiveBattles(io, finishBattleByTimeout);

const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});