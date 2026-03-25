import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [topUsers, setTopUsers] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    fetchStats();
    fetchTopUsers();
  }, []);

  const fetchStats = async () => {
    const res = await api.get("/admin/stats");
    setStats(res.data.data);
  };

  const fetchTopUsers = async () => {
    const res = await api.get("/admin/users");
    const sorted = res.data.data.sort((a, b) => b.rating - a.rating);
    setTopUsers(sorted.slice(0, 5)); // top 5 users
  };

  // =======================
  // CARD COMPONENT
  // =======================
  const Card = ({ title, value, icon, color }) => (
    <div className={`p-6 rounded-xl border border-gray-800 ${color}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-lg">{title}</h2>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold mt-2">{value || 0}</p>
    </div>
  );

  return (
    <div>

      {/* HEADER */}
      <h2 className="text-3xl font-bold mb-6">📊 Dashboard Overview</h2>

      {/* ================= STATS ================= */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">

        <Card
          title="Users"
          value={stats.users}
          icon="👤"
          color="bg-blue-900/30"
        />

        <Card
          title="Problems"
          value={stats.problems}
          icon="🧩"
          color="bg-purple-900/30"
        />

        <Card
          title="Categories"
          value={stats.categories}
          icon="📂"
          color="bg-yellow-900/30"
        />

        <Card
          title="Matches"
          value={stats.matches}
          icon="⚔️"
          color="bg-red-900/30"
        />

      </div>

      {/* ================= EXTRA INSIGHTS ================= */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* 🏆 TOP USERS */}
        <div className="bg-[#020617] p-6 rounded-xl border border-gray-800">
          <h3 className="text-xl font-semibold mb-4">🏆 Top Players</h3>

          {topUsers.map((u, i) => (
            <div
              key={u._id}
              className="flex justify-between py-2 border-b border-gray-800"
            >
              <span>
                {i + 1}. {u.name}
              </span>
              <span className="text-green-400">
                {u.rating}
              </span>
            </div>
          ))}
        </div>

        {/* 📈 SYSTEM INSIGHTS */}
        <div className="bg-[#020617] p-6 rounded-xl border border-gray-800">
          <h3 className="text-xl font-semibold mb-4">📈 Insights</h3>

          <p className="mb-2">
            Total Matches Played:{" "}
            <span className="text-green-400">{stats.matches}</span>
          </p>

          <p className="mb-2">
            Problems Available:{" "}
            <span className="text-purple-400">{stats.problems}</span>
          </p>

          <p className="mb-2">
            Active Categories:{" "}
            <span className="text-yellow-400">{stats.categories}</span>
          </p>

          <p>
            Total Users Joined:{" "}
            <span className="text-blue-400">{stats.users}</span>
          </p>
        </div>

      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <div className="mt-8 bg-[#020617] p-6 rounded-xl border border-gray-800">
        <h3 className="text-xl font-semibold mb-4">⚡ Quick Actions</h3>

        <div className="flex gap-4 flex-wrap">

            <button
                onClick={() => navigate("/admin/generate")}
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
            >
                ⚡ Generate Problems
            </button>

            <button
                onClick={() => navigate("/admin/users")}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
            >
                👤 View Users
            </button>

            <button
                onClick={() => navigate("/admin/categories")}
                className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded"
            >
                📂 Manage Categories
            </button>

            <button
                onClick={() => navigate("/admin/problems")}
                className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded"
            >
                🧩 View Problems
            </button>

            </div>
      </div>

    </div>
  );
}