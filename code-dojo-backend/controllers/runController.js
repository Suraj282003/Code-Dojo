const Problem = require("../models/Problem")
const TestCase = require("../models/TestCase")
const { judgeSubmission } = require("../services/judgeService")

exports.runCode = async (req, res) => {
  const { problemId, sourceCode, language } = req.body

  const testCases = await TestCase.find({
    problemId,
    isHidden: false,
  }).sort({ order: 1 })

  if (!testCases.length) {
    return res.status(400).json({ error: "No sample testcases found" })
  }

  const result = await judgeSubmission({
    sourceCode,
    language,
    testCases,
  })

  // 🚨 COMPILATION ERROR
  if (result.verdict === "COMPILE_ERROR") {
    return res.status(200).json({
      verdict: "COMPILE_ERROR",
      error: result.error,
    })
  }

  // 🚨 RUNTIME ERROR
  if (result.verdict === "RUNTIME_ERROR") {
    return res.status(200).json({
      verdict: "RUNTIME_ERROR",
      error: result.error,
    })
  }

  // ✅ Normal execution (sample testcases)
  return res.json(result)
}

