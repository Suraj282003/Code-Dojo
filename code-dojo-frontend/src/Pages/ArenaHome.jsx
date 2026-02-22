import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ArenaHome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black text-white">

      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/arena-bg.jpg"
          alt="Arena Background"
          className="w-full h-full object-cover opacity-40"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />

      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.25)_0%,transparent_70%)]" />

      {/* Content */}
      <div className="relative z-10 text-center">

        <p className="tracking-[0.5em] text-sm text-neutral-400 mb-6">
          RANKED ARENA
        </p>

        <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-b from-orange-400 to-red-600 bg-clip-text text-transparent leading-tight drop-shadow-[0_0_25px_rgba(255,0,0,0.4)]">
          ENTER THE <br /> BATTLEFIELD
        </h1>

        {/* Player Card */}
        <div className="mt-16 bg-black/70 backdrop-blur-md border border-red-700/40 rounded-2xl p-10 w-[480px] shadow-[0_0_50px_rgba(255,0,0,0.2)]">

          <h2 className="text-3xl tracking-widest font-serif mb-10">
            {user?.name || "Warrior"}
          </h2>

          <div className="grid grid-cols-3 gap-6 text-center">

            {/* Rating */}
            <div>
              <p className="text-sm text-neutral-400 tracking-wider">
                RATING
              </p>
              <p className="text-3xl text-orange-400 font-bold mt-2">
                {user?.rating || 1000}
              </p>
            </div>

            {/* Wins */}
            <div>
              <p className="text-sm text-neutral-400 tracking-wider">
                WINS
              </p>
              <p className="text-3xl text-green-400 font-bold mt-2">
                {user?.wins || 0}
              </p>
            </div>

            {/* Losses */}
            <div>
              <p className="text-sm text-neutral-400 tracking-wider">
                LOSSES
              </p>
              <p className="text-3xl text-red-500 font-bold mt-2">
                {user?.losses || 0}
              </p>
            </div>

          </div>
        </div>

        {/* Ranked Button */}
        <button
          onClick={() => navigate("/arena/waiting")}
          className="mt-14 px-14 py-5 text-xl tracking-widest font-semibold bg-gradient-to-r from-red-700 to-red-500 rounded-lg shadow-[0_0_30px_rgba(255,0,0,0.6)] hover:scale-105 transition-all duration-300"
        >
          START RANKED MATCH
        </button>

      </div>
    </div>
  );
}
