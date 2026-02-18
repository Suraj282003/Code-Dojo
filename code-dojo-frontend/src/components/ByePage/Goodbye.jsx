"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Goodbye() {
  const navigate = useNavigate();

  // Optional: auto-redirect back to login/home after some time
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login"); // or "/"
    }, 6000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-red-950 to-black text-red-100">
      <div className="text-center px-6">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-wide text-red-500 drop-shadow-lg">
          Until We Clash Again
        </h1>

        <p className="mt-6 text-lg md:text-xl text-red-300 max-w-xl mx-auto leading-relaxed">
          The battlefield rests… but the war is never over.
          <br />
          Sharpen your blades. Strengthen your spirit.
        </p>

        <p className="mt-4 text-red-400 italic">
          Return soon — the battle awaits your command.
        </p>

        <div className="mt-10 text-sm text-red-600 animate-pulse">
          You will be remembered, warrior.
        </div>
      </div>
    </div>
  );
}
