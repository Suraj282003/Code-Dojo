const Problem = require("../models/Problem")
const TestCase = require("../models/TestCase")
const Submission = require("../models/Submission")
const { judgeSubmission } = require("../services/judgeService")

exports.submitCode = async (req, res) => {
  const { problemId, sourceCode, language } = req.body

  const testCases = await TestCase.find({ problemId }).sort({ order: 1 })

  if (!testCases.length) {
    return res.status(400).json({ error: "No testcases found" })
  }

  const result = await judgeSubmission({
    sourceCode,
    language,
    testCases,
  })

  const submission = await Submission.create({
  problemId,
  language,
  sourceCode,
  verdict: result.verdict,
})

res.json({
  submissionId: submission._id,
  verdict: result.verdict,
  moveNext: result.verdict === "ACCEPTED",
  addTime: result.verdict === "ACCEPTED" ? 60 : 0,

  // 🔥 IMPORTANT: send error to frontend
  error:
    result.verdict === "COMPILE_ERROR" ||
    result.verdict === "RUNTIME_ERROR"
      ? result.error
      : null,

  details: result,
  })
}
