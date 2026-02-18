"use client";

import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function LogoutButton() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/goodbye");
  };

  return (
    <button
      onClick={handleLogout}
      className="gap-2 bg-transparent flex items-center"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </button>
  );
}
