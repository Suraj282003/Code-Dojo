import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const res = await api.get("/admin/users");
    setUsers(res.data.data);
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl mb-4">Users Overview</h2>

      {/* 🔍 SEARCH */}
      <input
        type="text"
        placeholder="Search user..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 bg-gray-800 rounded w-full"
      />

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm bg-[#020617] border border-gray-800 rounded">

          <thead className="bg-gray-800">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th>Email</th>
              <th>Rating</th>
              <th>Rank</th>
              <th>Wins</th>
              <th>Losses</th>
              <th>Matches</th>
              <th>Win %</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((u) => {
              const winRate =
                u.totalMatches > 0
                  ? ((u.wins / u.totalMatches) * 100).toFixed(1)
                  : 0;

              return (
                <tr key={u._id} className="border-t border-gray-800 hover:bg-gray-900">
                  <td className="p-3">{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.rating}</td>
                  <td className="text-green-400">{u.rank}</td>
                  <td className="text-green-400">{u.wins}</td>
                  <td className="text-red-400">{u.losses}</td>
                  <td>{u.totalMatches}</td>
                  <td>{winRate}%</td>
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>
    </div>
  );
}