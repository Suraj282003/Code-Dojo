import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navigation/NavBar";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleEnter = () => {
    if (isAuthenticated) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="bg-black text-white min-h-screen relative overflow-hidden">

      {/* Navbar */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center text-center min-h-screen px-6 pt-32 relative">

        {/* Background Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.25)_0%,transparent_70%)] animate-pulse" />

        {/* Logo Image */}
        <img
          src="/Image/Logo.png"
          alt="Code Dojo Logo"
          className="w-[300px] md:w-[420px] mb-8 relative z-10 drop-shadow-[0_0_40px_rgba(220,38,38,0.6)]"
        />

        {/* Tagline */}
        <h1 className="text-4xl md:text-6xl font-black tracking-widest relative z-10">
          ENTER THE CODE DOJO
        </h1>

        <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl relative z-10">
          Survival mode. Real-time battles. ELO ranking system.
          Train under pressure. Defeat opponents. Rise beyond 1200.
        </p>

        {/* Button */}
        <button
          onClick={handleEnter}
          className="mt-10 px-10 py-4 bg-red-700 hover:bg-red-800 rounded-xl font-bold tracking-wider hover:scale-110 transition-all duration-300 shadow-lg shadow-red-600/40 relative z-10"
        >
          🥷 ENTER THE DOJO
        </button>
      </section>

      {/* GAME MODES */}
      <section className="py-24 px-6 text-center bg-neutral-950">
        <h2 className="text-4xl font-bold mb-16 text-red-500">
          Game Modes
        </h2>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">

          {/* Survival */}
          <div className="bg-neutral-900 p-10 rounded-2xl border border-red-700 hover:scale-105 transition-all duration-300 shadow-md shadow-red-700/30">
            <h3 className="text-2xl font-bold mb-4">⚔️ Survival Mode</h3>
            <p className="text-gray-400">
              Solve coding challenges under strict time limits.
              If the timer runs out, you're eliminated.
              Train speed and accuracy like a warrior.
            </p>
          </div>

          {/* Battle */}
          <div className="bg-neutral-900 p-10 rounded-2xl border border-red-700 hover:scale-105 transition-all duration-300 shadow-md shadow-red-700/30">
            <h3 className="text-2xl font-bold mb-4">🏆 Online Battle Mode</h3>
            <p className="text-gray-400">
              Get matched with real opponents.
              Every user starts at 1200 ELO.
              Win to gain rating. Lose to drop.
              Climb the leaderboard.
            </p>
          </div>
        </div>
      </section>

      {/* PRACTICE */}
      <section className="py-24 text-center">
        <h2 className="text-4xl font-bold mb-8 text-red-500">
          📚 Practice Categories
        </h2>

        <p className="text-gray-400 max-w-3xl mx-auto">
          Improve before entering ranked battles.
          Choose topics, difficulty levels, and master your skills.
        </p>
      </section>

    </div>
  );
}