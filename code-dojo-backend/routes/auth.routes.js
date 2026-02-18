const express = require("express");
const { signup, login, logout, refreshToken } = require("../controllers/auth.Controller");
const { protect } = require("../Middleware/auth.middleware");
const { googleAuth } = require("../controllers/auth.Controller");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);


// Logout (protected)
router.post("/logout", protect, logout);

router.post("/refresh", refreshToken);

router.post("/google", googleAuth);


module.exports = router;
