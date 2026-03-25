"use client";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogoutButton } from "../Button/logout-button";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const firstLetter =
    user?.name?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 px-8 py-4 flex items-center justify-between transition-all duration-500
        ${
          scrolled
            ? "bg-black/95 backdrop-blur-md shadow-lg border-b border-red-700"
            : "bg-transparent"
        }`}
    >
      {/* LEFT - LOGO */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center cursor-pointer group"
      >
        <img
          src="/Image/Logo.png"
          alt="Code Dojo Logo"
          className="h-10 w-10 object-cover transition-transform duration-300 group-hover:scale-110 rounded-full"
        />
      </div>

      {/* RIGHT SIDE */}
        <div className="flex items-center gap-8 text-white font-semibold">

        {/* Home */}
        <button
          onClick={() => navigate("/")}
          className="relative hover:text-red-500 transition duration-300 group"
        >
          Home
          <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full"></span>
        </button>

        {/* Survival */}
        <button
          onClick={() => navigate("/catogaries")}
          className="relative hover:text-red-500 transition duration-300 group"
        >
          Survival
          <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full"></span>
        </button>

        {/* Arena */}
        <button
          onClick={() => navigate("/arena")}
          className="relative hover:text-red-500 transition duration-300 group"
        >
          Arena
          <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full"></span>
        </button>

        {/* 🔥 ADMIN PANEL (ONLY FOR ADMIN) */}
        {isAuthenticated && user?.role === "admin" && (
          <button
            onClick={() => navigate("/admin")}
            className="relative text-yellow-400 hover:text-yellow-300 transition duration-300 group"
          >
            Admin
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
          </button>
        )}

        {isAuthenticated && (
          <>
            {/* Profile */}
            <div
              onClick={() => navigate("/profile")}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-red-700 text-white font-bold cursor-pointer hover:scale-110 transition duration-300 shadow-md shadow-red-600/60"
            >
              {firstLetter}
            </div>

            {/* Logout */}
            <div className="hover:text-red-500 transition duration-300">
              <LogoutButton />
            </div>
          </>
        )}
      </div>
    </nav>
  );
}