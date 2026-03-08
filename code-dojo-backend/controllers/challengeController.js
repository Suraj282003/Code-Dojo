const Submission = require("../models/Submission")
const TestCase = require("../models/TestCase")
const executionService = require("../services/executionService")
const Category = require("../models/Category")
const ChallengeRun = require("../models/ChallengeRun")
const { judgeSubmission } = require("../services/judgeService")

exports.startRun = async (req, res) => {
  const { userId, categoryId } = req.body

  const category = await Category.findById(categoryId)
  if (!category.problems || category.problems.length < 7) {
    return res.status(400).json({
      error: "Category does not have enough problems"
    });
  }

  category.problems = category.problems.filter(p => p.problemId);

  // Always start fresh
  const run = new ChallengeRun({
    userId,
    categoryId,
    currentIndex: 0,
    timeRemaining: category.initialTime,
  })

  await run.save()

  // sort problems
  category.problems.sort((a, b) => a.order - b.order)

  res.status(201).json({
    runId: run._id,
    problemId: category.problems[0].problemId,
    timeRemaining: run.timeRemaining,
  })
}


exports.getCurrentProblem = async (req, res) => {
  const { runId } = req.params

  const run = await ChallengeRun.findById(runId)
  if (!run || run.status !== "ACTIVE") {
    return res.status(404).json({ error: "Run not active" })
  }

  const category = await Category.findById(run.categoryId)
  category.problems.sort((a, b) => a.order - b.order)

  const problemEntry = category.problems[run.currentIndex]

  const now = Date.now()
  const elapsed = Math.floor((now - run.startedAt.getTime()) / 1000)

  const remaining = Math.max(run.timeRemaining - elapsed, 0)

  // update DB so future calls stay correct
  run.timeRemaining = remaining
  run.startedAt = new Date()
  await run.save()

  res.json({
    problemId: problemEntry.problemId,
    timeRemaining: remaining,
  })
}

exports.submitInRun = async (req, res) => {
  try {
    const { runId } = req.params
    const { language, sourceCode } = req.body
    const category = await Category.findById(run.categoryId);
    category.problems.sort((a, b) => a.order - b.order);

    const problemId = category.problems[run.currentIndex].problemId;

    const userId = req.body.userId || "demo-user"

    const testCases = await TestCase.find({
    problemId,
    isHidden: true,   // hidden for submit
    }).sort({ order: 1 })

    if (!testCases.length) {
      return res.status(400).json({ error: "No hidden testcases found" })
    }


    // 1️⃣ Validate run
    const run = await ChallengeRun.findById(runId)
    if (!run || run.status !== "ACTIVE") {
      return res.status(400).json({ error: "Run not active" })
    }

    // 2️⃣ Time check
    if (run.timeRemaining <= 0) {
      run.status = "FAILED"
      run.endedAt = new Date()
      await run.save()
      return res.json({ status: "FAILED", reason: "TIME_UP" })
    }


    // const problemId = category.problems[run.currentIndex].problemId

    // 4️⃣ 🔥 REAL JUDGE CALL (THIS WAS MISSING)
const result = await judgeSubmission({
  problemId,
  language,
  sourceCode,
  testCases,
  mode: "SUBMIT",
})

if (result.verdict !== "ACCEPTED") {
  run.status = "FAILED"
  await run.save()
  return res.json({ status: "FAILED" })
}

    // 6️⃣ PASS → MOVE NEXT
    run.currentIndex += 1
    run.timeRemaining += 60
    run.startedAt = new Date()


    // 7️⃣ COMPLETED
    if (run.currentIndex >= category.problems.length) {
      run.status = "COMPLETED"
      run.endedAt = new Date()
      await run.save()

      const problem = await Problem.findById(problemId);
        problem.usageCount += 1;
        problem.lastUsedAt = new Date();
        await problem.save();

      return res.json({
        status: "COMPLETED",
      })
    }

    await run.save()

    return res.json({
      status: "NEXT",
      nextProblemId: category.problems[run.currentIndex].problemId,
      timeRemaining: run.timeRemaining,
    })

  } catch (err) {
    console.error("[submitInRun]", err)
    res.status(500).json({ error: err.message })
  }
}