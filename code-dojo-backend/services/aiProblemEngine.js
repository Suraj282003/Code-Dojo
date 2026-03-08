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

function getRatingRange(difficulty) {
  if (difficulty === "Easy") return { min: 800, max: 1200 };
  if (difficulty === "Medium") return { min: 1200, max: 1800 };
  if (difficulty === "Hard") return { min: 1800, max: 3000 };
}

async function generateStructuredProblem(category, difficulty) {
  const rating = getRatingRange(difficulty);
  const aiInstance = await getAI();

  const prompt = `
Generate a competitive programming problem.

Category: ${category}
Difficulty: ${difficulty}

Return ONLY valid JSON.

{
  "problem": {
    "title": "string",
    "description": "clear competitive programming problem description including constraints",
    "difficulty": "${difficulty}",
    "minRating": ${rating.min},
    "maxRating": ${rating.max},
    "timeLimitMs": 2000,
    "memoryLimitMb": 256,
    "tags": ["tag1","tag2"]
  },
  "testCases": [
    {
      "input": "sample input",
      "expectedOutput": "sample output",
      "isHidden": false
    },
    {
      "input": "sample input 2",
      "expectedOutput": "sample output 2",
      "isHidden": false
    },
    {
      "input": "edge case input",
      "expectedOutput": "edge output",
      "isHidden": true
    },
    {
      "input": "large boundary case",
      "expectedOutput": "correct output",
      "isHidden": true
    },
    {
      "input": "random valid case",
      "expectedOutput": "correct output",
      "isHidden": true
    }
  ]
}
`;

  const response = await aiInstance.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt
  });

  const text =
    response.candidates?.[0]?.content?.parts?.[0]?.text || "";

  if (!text) {
    throw new Error("Empty response from Gemini");
  }

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned);

    if (!parsed.problem || !parsed.testCases) {
      throw new Error("Invalid AI response structure");
    }

    if (parsed.testCases.length < 3) {
      throw new Error("Insufficient testcases");
    }

    return parsed;

  } catch (err) {
    console.error("Gemini raw response:", text);
    throw new Error("Gemini returned invalid JSON");
  }
}

async function generateCategoryPackFromAI(category) {
  const aiInstance = await getAI();

  const prompt = `
Generate 7 competitive programming problems for category: ${category}

Difficulty distribution:
- 3 Easy
- 2 Medium
- 2 Hard

Return ONLY valid JSON:

{
  "initialTime": number,
  "problems": [
    {
      "problem": {...},
      "testCases": [...]
    }
  ]
}
`;

  const response = await aiInstance.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt
  });

  const text =
    response.candidates?.[0]?.content?.parts?.[0]?.text || "";

  if (!text) {
    throw new Error("Empty response from Gemini");
  }

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned);

    if (!parsed.initialTime || !parsed.problems || parsed.problems.length !== 7) {
      throw new Error("Invalid AI pack format");
    }

    return parsed;

  } catch (err) {
    console.error("Gemini raw response:", text);
    throw new Error("Gemini returned invalid pack JSON");
  }
}

module.exports = {
  generateStructuredProblem,
  generateCategoryPackFromAI
};