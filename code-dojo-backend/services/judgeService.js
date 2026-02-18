const { executeCode } = require("./executionService")
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

async function judgeSubmission({ sourceCode, language, testCases }) {
  let passedCount = 0
  const results = []

  for (const testCase of testCases) {
    const execution = await executeCode({
      sourceCode,
      language,
      input: testCase.input,
    })

    // 🚨 COMPILATION ERROR
    if (execution.status === "COMPILE_ERROR") {
      return {
        verdict: "COMPILE_ERROR",
        error: execution.stderr,
      }
    }

    // 🚨 RUNTIME ERROR
    if (execution.status === "RUNTIME_ERROR") {
      return {
        verdict: "RUNTIME_ERROR",
        error: execution.stderr,
      }
    }

    // ✅ SUCCESS
    const output = (execution.stdout || "").trim()
    const expected = testCase.expectedOutput.trim()
    const passed = output === expected

    if (passed) passedCount++

    results.push({
      input: testCase.input,
      expected,
      output,
      passed,
    })

    // ❌ FAIL FAST
    if (!passed) {
      return {
        verdict: "WRONG_ANSWER",
        passedCount,
        total: testCases.length,
        results,
      }
    }

    await sleep(250)
  }

  return {
    verdict: "ACCEPTED",
    passedCount,
    total: testCases.length,
    results,
  }
}

module.exports = { judgeSubmission }
