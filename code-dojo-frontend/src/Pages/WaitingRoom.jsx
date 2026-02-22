import { useSocket } from "../context/socketContext";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function WaitingRoom() {
  const socket = useSocket();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [status, setStatus] = useState("searching");
  const [battle, setBattle] = useState(null);
  const [countdown, setCountdown] = useState(10);

// ================= REFRESH BATTEL =================
  useEffect(() => {
    if (!socket) return;

    const savedBattleId = localStorage.getItem("activeBattleId");
    const savedStatus = localStorage.getItem("battleStatus");

    const tryReconnect = () => {
      if (savedBattleId) {
        // console.log("🔁 Reconnecting to battle:", savedBattleId);
        socket.emit("battle:reconnect", { battleId: savedBattleId });
      }
    };

    if (socket.connected) {
      tryReconnect();
    } else {
      socket.once("connect", tryReconnect);
    }

    if (savedStatus === "matched") {
      setStatus("matched");
    }

  }, [socket]);

  // ================= SOCKET MATCHMAKING =================
  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      const savedBattleId = localStorage.getItem("activeBattleId");

      if (savedBattleId) {
        console.log("⚠ Already in battle, not searching again");
        return;
      }

      console.log("🔥 Searching for ranked battle");
      socket.emit("battle:find");
    };

    if (socket.connected) {
      handleConnect();
    } else {
      socket.on("connect", handleConnect);
    }

    socket.on("battle:waiting", () => {
      setStatus("searching");
    });

    socket.on("battle:start", (battleData) => {
      localStorage.setItem("activeBattleId", battleData._id);
      localStorage.setItem("battleStatus", "matched");

      setBattle(battleData);
      setStatus("matched");
    });

    socket.on("battle:resume", (battleData) => {
      // console.log("♻ Battle resumed:", battleData);

      setBattle(battleData);
      setStatus("matched");
    });

    socket.on("battle:error", (msg) => {
      alert(msg);
      navigate("/arena");
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("battle:waiting");
      socket.off("battle:start");
      socket.off("battle:error");
      socket.off("battle:resume");
    };
  }, [socket, navigate]);

  // ================= COUNTDOWN =================
  useEffect(() => {
    if (status !== "matched") return;

    if (countdown === 0) {
      navigate("/arena/fight", { state: { battle } });
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [status, countdown, navigate, battle]);

  // Safely find opponent
const opponent = battle?.players?.find(
  (p) => String(p.userId) !== String(user?.id)
);
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(185,28,28,0.15)_0%,transparent_60%)]" />

      {/* ================= SEARCHING ================= */}
      {status === "searching" && (
        <>
          <h1 className="text-4xl font-bold text-amber-400 mb-8 tracking-widest">
            Searching for Ranked Opponent...
          </h1>

          <div className="animate-pulse text-neutral-400">
            Matching warriors by rating ⚔
          </div>
        </>
      )}

      {/* ================= MATCHED ================= */}
      {status === "matched" && battle && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-10 w-[500px] text-center shadow-lg">

          <h2 className="text-2xl text-amber-400 mb-6 tracking-wider">
            Opponent Found
          </h2>

          <div className="flex justify-between mb-6">

            {/* You */}
            <div>
              <p className="text-red-600 font-semibold">
                {user?.warriorName || user?.name}
              </p>
              <p className="text-sm text-neutral-400">
                Rating {user?.rating}
              </p>
            </div>

            {/* Opponent */}
            <div>
              <p className="text-neutral-300 font-semibold">
                {opponent?.name || "Opponent"}
              </p>
              <p className="text-sm text-neutral-400">
                Rating {opponent?.ratingSnapshot}
              </p>
            </div>

          </div>

          <div className="border-t border-neutral-800 pt-4 mb-6">
            <p className="text-neutral-400">
              Ranked Battle
            </p>
            <p className="text-lg text-amber-400 font-semibold">
              Rating will be updated after match
            </p>
          </div>

          <p className="text-amber-400 text-lg">
            Battle begins in {countdown}...
          </p>

        </div>
      )}

    </div>
  );
}
