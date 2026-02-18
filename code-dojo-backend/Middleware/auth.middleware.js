const jwt = require("jsonwebtoken");
const User = require("../models/users");
const redisClient = require("../config/redis");

exports.protect = async (req, res, next) => {
  let token;

  // 1️⃣ Get token from header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token, authorization denied",
    });
  }

  try {
    // 2️⃣ Verify ACCESS token (IMPORTANT FIX)
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // 3️⃣ OPTIONAL: Redis blacklist check (if Redis enabled)
    if (decoded.jti) {
      const isBlacklisted = await redisClient.get(`bl_${decoded.jti}`);
      if (isBlacklisted) {
        return res.status(401).json({
          success: false,
          message: "Token revoked",
        });
      }
    }

    // 4️⃣ Attach user to request
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Token invalid or expired",
    });
  }
};
