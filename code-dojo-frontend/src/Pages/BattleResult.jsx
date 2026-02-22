import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function BattleResult() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const result = location.state?.result;

  if (!result) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-950 text-amber-400">
        No result found.
      </div>
    );
  }

  if (!user?.id) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-950 text-amber-400">
        Loading...
      </div>
    );
  }

  const isWinner =
    String(result.winner) === String(user.id);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-neutral-950 text-neutral-100">

      {/* RESULT TITLE */}
      <h1 className="text-5xl font-bold mb-6 text-amber-400">
        {result.verdict === "DRAW"
          ? "⚔️ Draw"
          : isWinner
          ? "🏆 Victory!"
          : "💀 Defeat"}
      </h1>

      {/* RATING CHANGE */}
      {result.ratingChange && (
        <div className="text-2xl mb-8">
          Rating Change:{" "}
          <span className={isWinner ? "text-green-500" : "text-red-500"}>
            {isWinner
              ? `+${result.ratingChange.winner}`
              : `${result.ratingChange.loser}`}
          </span>
        </div>
      )}

      {/* BUTTON */}
      <button
        onClick={() => navigate("/arena")}
        className="px-6 py-3 bg-red-700 rounded-lg hover:bg-red-600 transition"
      >
        Return to Dojo
      </button>
    </div>
  );
}