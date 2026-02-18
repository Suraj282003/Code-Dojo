const jwt = require("jsonwebtoken");
const User = require("../models/users");

async function socketAuth(socket, next) {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) return next(new Error("Authentication error"));

    // console.log("Received token:", token);
    // console.log("JWT_SECRET:", process.env.JWT_ACCESS_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // console.log("Decoded:", decoded);

    const user = await User.findById(decoded.id);
    if (!user) return next(new Error("Authentication error"));

    if (!user) {
      console.log("User not found");
      return next(new Error("User not found"));
    }

    socket.user = user;
    next();
  } catch (err) {
    console.log("❌ JWT Error:", err.message);
    next(new Error("Authentication error"));
  }
}

module.exports = socketAuth;
