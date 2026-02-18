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

useEffect(() => {
  if (!socket) return;

  console.log("🔥 Searching for battle");
  socket.emit("battle:find");

  socket.on("battle:waiting", () => {
    setStatus("searching");
  });

  socket.on("battle:start", (battleData) => {
    setBattle(battleData);
    setStatus("matched");
  });

  socket.on("battle:error", (msg) => {
    alert(msg);
    navigate("/arena");
  });

  return () => {
    socket.off("battle:waiting");
    socket.off("battle:start");
    socket.off("battle:error");
  };
}, [socket, navigate]);

  useEffect(() => {
    if (status !== "matched") return;

    if (countdown === 0) {
      navigate("/arena/fight", { state: { battle } });
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [status, countdown, navigate, battle]);


  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(185,28,28,0.15)_0%,transparent_60%)]" />

      {status === "searching" && (
        <>
          <h1 className="text-4xl font-bold text-amber-400 mb-8 tracking-widest">
            Searching for an Opponent...
          </h1>

          <div className="animate-pulse text-neutral-400">
            Sharpening blades ⚔
          </div>
        </>
      )}

      {status === "matched" && battle && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-10 w-[500px] text-center shadow-lg">

          <h2 className="text-2xl text-amber-400 mb-6 tracking-wider">
            Opponent Found
          </h2>

          <div className="flex justify-between mb-6">
            <div>
              <p className="text-red-600 font-semibold">
                {user?.warriorName}
              </p>
              <p className="text-sm text-neutral-400">
                Level {user?.level}
              </p>
            </div>

            <div>
              <p className="text-neutral-300 font-semibold">
                Opponent
              </p>
              <p className="text-sm text-neutral-400">
                Level {battle.players[1]?.level}
              </p>
            </div>
          </div>

          <div className="border-t border-neutral-800 pt-4 mb-6">
            <p className="text-neutral-400">Total Prize Pool</p>
            <p className="text-3xl text-red-600 font-bold">
              {battle.totalPot} Coins
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
