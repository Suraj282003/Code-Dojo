import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function AdminGenerate() {
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [problems, setProblems] = useState([]);

  const { user } = useAuth();

  const generateProblems = async () => {
    setLoading(true);
    setMessage("");
    setProblems([]);

    try {
      const res = await api.post("/admin/generate-category", {
        category
      });

      if (res.data.success) {
        setMessage("✅ Problems generated successfully");
        setProblems(res.data.problems);
      } else {
        setMessage("❌ " + res.data.message);
      }

    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Server Error");
    }

    setLoading(false);
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-xl">
        Access Denied (Admin Only)
      </div>
    );
  }

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">Generate Problems</h1>

      {/* INPUT */}
      <div className="bg-[#020617] p-6 rounded-xl mb-6 border border-gray-800">

        <h2 className="text-xl mb-4">Generate Category Pack</h2>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter category (e.g. Arrays)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 p-3 bg-gray-900 border border-gray-700 rounded"
          />

          <button
            onClick={generateProblems}
            className="bg-green-500 px-6 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {message && <p className="mt-3 text-gray-400">{message}</p>}
      </div>

      {/* 🔥 FULL PROBLEM VIEW */}
      <div className="space-y-6">

        {problems.map((p, index) => (
          <div
            key={p.id}
            className="bg-[#020617] border border-gray-800 p-6 rounded-xl"
          >

            {/* TITLE */}
            <h2 className="text-xl font-bold mb-2">
              {index + 1}. {p.title}
            </h2>

            {/* DIFFICULTY */}
            <span className={`text-xs px-2 py-1 rounded ${
              p.difficulty === "Easy"
                ? "bg-green-600"
                : p.difficulty === "Medium"
                ? "bg-yellow-600"
                : "bg-red-600"
            }`}>
              {p.difficulty}
            </span>

            {/* DESCRIPTION */}
            <p className="mt-4 whitespace-pre-line">
              {p.description}
            </p>

            {/* TAGS */}
            <div className="mt-4 flex gap-2 flex-wrap">
              {p.tags?.map((tag, i) => (
                <span key={i} className="bg-gray-700 px-2 py-1 rounded text-sm">
                  {tag}
                </span>
              ))}
            </div>

            {/* TEST CASES */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Test Cases</h3>

              {p.testCases?.map((tc, i) => (
                <div key={i} className="bg-gray-800 p-3 mb-2 rounded">
                  <p><b>Input:</b> {tc.input}</p>
                  <p><b>Output:</b> {tc.expectedOutput}</p>
                  <p>
                    <b>Hidden:</b>{" "}
                    {tc.isHidden ? "Yes" : "No"}
                  </p>
                </div>
              ))}
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}