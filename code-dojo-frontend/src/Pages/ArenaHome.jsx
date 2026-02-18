import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function ArenaHome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black text-white">

      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/arena-bg.jpg"
          alt="Arena Background"
          className="w-full h-full object-cover opacity-40"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />

      {/* Red Glow Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.25)_0%,transparent_70%)]" />

      {/* Main Content */}
      <div className="relative z-10 text-center">

        {/* Small Header */}
        <p className="tracking-[0.5em] text-sm text-neutral-400 mb-6">
          CODE DOJO
        </p>

        {/* Main Title */}
        <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-b from-orange-400 to-red-600 bg-clip-text text-transparent leading-tight drop-shadow-[0_0_25px_rgba(255,0,0,0.4)]">
          WELCOME TO <br /> THE ARENA
        </h1>

        {/* Warrior Card */}
        <div className="mt-16 bg-black/70 backdrop-blur-md border border-red-700/40 rounded-2xl p-10 w-[450px] shadow-[0_0_50px_rgba(255,0,0,0.2)]">

          {/* Shield Icon */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-red-600 flex items-center justify-center">
            <div className="w-6 h-6 bg-red-600 rounded-sm rotate-45" />
          </div>

          {/* Warrior Name */}
          <h2 className="text-3xl tracking-widest font-serif mb-8">
            {user?.warriorName || "ShadowBlade"}
          </h2>

          {/* Stats */}
          <div className="flex justify-around text-center">

            <div>
              <p className="text-sm text-neutral-400 tracking-wider">
                LEVEL
              </p>
              <p className="text-3xl text-orange-400 font-bold mt-2">
                {user?.level || 1}
              </p>
            </div>

            <div>
              <p className="text-sm text-neutral-400 tracking-wider">
                COINS
              </p>
              <p className="text-3xl text-orange-400 font-bold mt-2">
                {user?.battleCoins || 0}
              </p>
            </div>

          </div>

        </div>

        {/* Enter Button */}
        <button
          onClick={() => navigate("/arena/waiting")}
          className="mt-14 px-12 py-4 text-xl tracking-widest font-semibold bg-gradient-to-r from-red-700 to-red-500 rounded-lg shadow-[0_0_30px_rgba(255,0,0,0.6)] hover:scale-105 transition-all duration-300"
        >
          ENTER THE DOJO
        </button>

      </div>

    </div>
  );
}
