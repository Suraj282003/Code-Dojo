import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminProblems() {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    const res = await api.get("/admin/problems");
    setProblems(res.data.data);
  };

  const loadProblemDetails = async (id) => {
    const res = await api.get(`/admin/problem/${id}`);
    setSelectedProblem(res.data.data);
  };

  // 🔥 SEARCH FILTER
  const filteredProblems = problems.filter((p) => {
    const text = search.toLowerCase();

    return (
      p.title.toLowerCase().includes(text) ||
      p.difficulty.toLowerCase().includes(text) ||
      p.tags?.join(" ").toLowerCase().includes(text)
    );
  });

  return (
    <div>
      <h2 className="text-2xl mb-4">All Problems</h2>

      {/* 🔍 SEARCH BAR */}
      <input
        type="text"
        placeholder="Search by title, difficulty, tags..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-3 bg-gray-800 rounded w-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      {/* LIST */}
      <div className="grid md:grid-cols-2 gap-3">
        {filteredProblems.map((p) => (
          <div
            key={p._id}
            onClick={() => loadProblemDetails(p._id)}
            className="bg-[#020617] p-4 rounded cursor-pointer hover:bg-gray-800 transition"
          >
            <h3 className="font-bold">{p.title}</h3>

            <p className="text-sm text-gray-400">
              {p.difficulty}
            </p>

            {/* TAGS */}
            <div className="flex gap-2 mt-2 flex-wrap">
              {p.tags?.map((tag, i) => (
                <span key={i} className="bg-gray-700 px-2 py-1 text-xs rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* NO RESULT */}
      {filteredProblems.length === 0 && (
        <p className="text-gray-400 mt-4">No problems found</p>
      )}

      {/* MODAL (keep your existing modal here) */}
      {selectedProblem && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">

          <div className="bg-[#020617] w-[800px] p-6 rounded-xl max-h-[90vh] overflow-y-auto">

            <button
              onClick={() => setSelectedProblem(null)}
              className="float-right text-red-400"
            >
              ✖
            </button>

            <h2 className="text-xl font-bold mb-2">
              {selectedProblem.problem.title}
            </h2>

            <p className="mt-3 whitespace-pre-line">
              {selectedProblem.problem.description}
            </p>

            <div className="mt-3">
              <b>Difficulty:</b> {selectedProblem.problem.difficulty}
            </div>

            <div className="mt-3">
              <b>Tags:</b>{" "}
              {selectedProblem.problem.tags?.join(", ")}
            </div>

            <h3 className="mt-4">Test Cases</h3>

            {selectedProblem.testCases.map((tc, i) => (
              <div key={i} className="bg-gray-800 p-2 mt-2">
                <p>Input: {tc.input}</p>
                <p>Output: {tc.expectedOutput}</p>
                <p>Hidden: {tc.isHidden ? "Yes" : "No"}</p>
              </div>
            ))}

          </div>
        </div>
      )}
    </div>
  );
}