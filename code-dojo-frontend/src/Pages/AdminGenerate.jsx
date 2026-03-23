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
        setMessage("✅ Problems Generated Successfully!");
        setProblems(res.data.problems); // 🔥 STORE PROBLEMS
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
      <div className="p-6 text-red-500">
        ❌ Access Denied (Admin Only)
      </div>
    );
  }

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🚀 Admin Dashboard</h1>

      {/* INPUT */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter Category (e.g. Arrays)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 text-black rounded mr-3"
        />

        <button
          onClick={generateProblems}
          className="bg-green-500 px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Problems"}
        </button>
      </div>

      {/* MESSAGE */}
      <p className="mb-4">{message}</p>

      {/* 🔥 PROBLEM LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {problems.map((p, index) => (
          <div key={p.id} className="bg-gray-800 p-4 rounded shadow">
            <h2 className="text-lg font-bold">
              {index + 1}. {p.title}
            </h2>
            <p className="text-sm text-gray-400">
              Difficulty: {p.difficulty}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}