const express = require("express");
const router = express.Router();
const battleController = require("../controllers/battleController");
const { protect } = require("../Middleware/auth.middleware");

router.post("/find", protect, battleController.findBattle);

module.exports = router;
