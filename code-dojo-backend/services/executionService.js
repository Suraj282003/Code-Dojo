const axios = require("axios")

const PISTON_URL = "https://emkc.org/api/v2/piston/execute"

function mapLanguage(language) {
  switch (language) {
    case "javascript":
      return { language: "javascript", version: "18.15.0" }

    case "java":
      return { language: "java", version: "17.0.0" }

    case "python":
      return { language: "python3", version: "3.10.0" }

    case "cpp":
      return { language: "cpp", version: "10.2.0" }

    default:
      throw new Error(`Unsupported language: ${language}`)
  }
}

async function executeCode({ sourceCode, language, input }) {
  const langConfig = mapLanguage(language)

  const payload = {
    language: langConfig.language,
    version: langConfig.version,
    files: [{ name: "Main", content: sourceCode }],
    stdin: input + "\n",
  }

  try {
    const response = await axios.post(PISTON_URL, payload)
    const data = response.data

    // 🚨 Compilation Error
    if (data.compile && data.compile.code !== 0) {
      return {
        status: "COMPILE_ERROR",
        stdout: "",
        stderr: data.compile.stderr,
      }
    }

    // 🚨 Runtime Error
    if (data.run.code !== 0) {
      return {
        status: "RUNTIME_ERROR",
        stdout: data.run.stdout,
        stderr: data.run.stderr,
      }
    }

    // ✅ Success
    return {
      status: "SUCCESS",
      stdout: data.run.stdout,
      stderr: "",
    }

  } catch (err) {
    return {
      status: "SYSTEM_ERROR",
      stdout: "",
      stderr: err.response?.data || err.message,
    }
  }
}

module.exports = { executeCode }
