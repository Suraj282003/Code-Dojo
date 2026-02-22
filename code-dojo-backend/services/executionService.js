const axios = require("axios")

const PISTON_URL = "http://piston:2000/api/v2/execute"

function mapLanguage(language) {
  switch (language) {
    case "javascript":
      return { language: "node", version: "18.15.0" }

    case "java":
      return { language: "java", version: "15.0.2" }

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
    files: [
      {
        name:
          language === "java"
            ? "Main.java"
            : language === "cpp"
            ? "main.cpp"
            : language === "python"
            ? "main.py"
            : "main.js",
        content: sourceCode,
      },
    ],
    stdin: input,
  }

  // 🚨 IMPORTANT FIX FOR JAVA
  if (language === "java") {
    payload.run = {
      command: "java Main",
    }
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
