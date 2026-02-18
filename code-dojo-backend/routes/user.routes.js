const express = require("express");
const { protect } = require("../Middleware/auth.middleware");
const { getProfile } = require("../controllers/user.controller");

const router = express.Router();

// GET user profile
router.get("/profile", protect, getProfile);

module.exports = router;
