const express = require("express")
const router = express.Router()
const challengeController = require("../controllers/challengeController")

router.post("/start", challengeController.startRun)
router.get("/:runId/current", challengeController.getCurrentProblem)
router.post("/:runId/submit", challengeController.submitInRun)

module.exports = router
