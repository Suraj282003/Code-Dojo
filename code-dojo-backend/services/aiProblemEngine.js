let ai = null;

async function getAI() {
  if (!ai) {
    const { GoogleGenAI } = await import("@google/genai");

    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });
  }
  return ai;
}

// =======================
// Rating Range
// =======================
function getRatingRange(difficulty) {
  if (difficulty === "Easy") return { min: 800, max: 1200 };
  if (difficulty === "Medium") return { min: 1200, max: 1800 };
  if (difficulty === "Hard") return { min: 1800, max: 3000 };
}

// =======================
// Retry System
// =======================
async function retryGenerate(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      console.log(`Retry ${i + 1} failed:`, err.message);
    }
  }
  throw new Error("AI failed after retries");
}

// =======================
// Validate AI Output
// =======================
function validateProblem(data) {
  if (!data || typeof data !== "object") return false;

  const p = data.problem;
  const t = data.testCases;

  if (!p || !p.title || !p.description) return false;
  if (!Array.isArray(t) || t.length < 4) return false;

  return true;
}

// =======================
// Normalize TestCases
// =======================
function normalizeTestCases(testCases) {
  const safe = (testCases || [])
    .filter(tc => tc && tc.input && tc.expectedOutput)
    .slice(0, 4);

  while (safe.length < 4) {
    safe.push({
      input: "1",
      expectedOutput: "1",
      isHidden: safe.length >= 2
    });
  }

  return safe.map((tc, index) => ({
    ...tc,
    isHidden: index >= 2
  }));
}

// =======================
// MAIN FUNCTION
// =======================
async function generateStructuredProblem(category, difficulty) {
  const rating = getRatingRange(difficulty);

  return retryGenerate(async () => {
    const aiInstance = await getAI();

    const prompt = `
STRICTLY return valid JSON.

Generate ONE competitive programming problem.

Category: ${category}
Difficulty: ${difficulty}

Rules:
- EXACTLY 4 test cases
- FIRST 2 → isHidden: false
- LAST 2 → isHidden: true
- NO markdown, NO explanation

Format:
{
  "problem": {
    "title": "string",
    "description": "string",
    "difficulty": "${difficulty}",
    "minRating": ${rating.min},
    "maxRating": ${rating.max},
    "timeLimitMs": 2000,
    "memoryLimitMb": 256,
    "tags": ["tag1","tag2"]
  },
  "testCases": [
    { "input": "x", "expectedOutput": "y", "isHidden": false },
    { "input": "x", "expectedOutput": "y", "isHidden": false },
    { "input": "x", "expectedOutput": "y", "isHidden": true },
    { "input": "x", "expectedOutput": "y", "isHidden": true }
  ]
}
`;

    const response = await aiInstance.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt
    });

    const text =
      response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!text) throw new Error("Empty response");

    const cleaned = text.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(cleaned);

    if (!validateProblem(parsed)) {
      throw new Error("Invalid structure");
    }

    parsed.testCases = normalizeTestCases(parsed.testCases);

    return parsed;
  });
}

module.exports = {
  generateStructuredProblem
};