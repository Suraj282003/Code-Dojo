import { useAuth } from "../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function AdminLayout({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-red-500 text-xl">
        Access Denied (Admin Only)
      </div>
    );
  }

  const navItem = (path, name) => (
    <Link to={path}>
      <div
        className={`p-2 rounded cursor-pointer ${
          location.pathname === path
            ? "bg-green-500 text-black"
            : "hover:bg-gray-800"
        }`}
      >
        {name}
      </div>
    </Link>
  );

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white">

      {/* SIDEBAR */}
      <div className="w-64 bg-[#020617] p-5 border-r border-gray-800">

        {/* 🔥 LOGO */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 mb-8 cursor-pointer hover:opacity-80"
        >
          <img
            src="/Image/Logo.png"
            alt="Code Dojo"
            className="w-12 h-12 object-cover"
          />
          <h2 className="text-xl font-bold text-green-400">Code Dojo</h2>
        </div>

        {/* 🔥 BACK TO HOME */}
        <div
          onClick={() => navigate("/")}
          className="mb-6 p-2 rounded bg-gray-800 hover:bg-gray-700 cursor-pointer text-center"
        >
          ⬅ Back to Home
        </div>

        {/* NAVIGATION */}
        <nav className="space-y-4">
          {navItem("/admin", "Dashboard")}
          {navItem("/admin/users", "Users")}
          {navItem("/admin/generate", "Generate")}
          {navItem("/admin/problems", "Problems")}
          {navItem("/admin/categories", "Categories")}
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          {/* LEFT: TITLE */}
          <h1 className="text-2xl font-bold">Admin Panel</h1>

          {/* RIGHT: USER + HOME BUTTON */}
          <div className="flex items-center gap-4">

            {/* 🔥 HOME BUTTON */}
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm transition"
            >
              🏠 Home
            </button>

            {/* USER */}
            <div className="bg-gray-800 px-4 py-2 rounded">
              👤 {user.name}
            </div>

          </div>
        </div>

        {children}
      </div>
    </div>
  );
}