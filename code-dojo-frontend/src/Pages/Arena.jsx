import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { CodeRunner } from "../components/CodeRunner/coderunner";
import { Timer } from "../components/Timer/timer";
import { useSocket } from "../context/socketContext";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Arena() {
  const { user } = useAuth();
  const socket = useSocket();
  const location = useLocation();
  const navigate = useNavigate();

  const battleFromState = location.state?.battle;

  const [battle, setBattle] = useState(battleFromState || null);
  const [status, setStatus] = useState(battle ? "active" : "loading");

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");

  const [runResult, setRunResult] = useState(null);
  const [canSubmit, setCanSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [yourProgress, setYourProgress] = useState(0);
  const [opponentProgress, setOpponentProgress] = useState(0);

  const [result, setResult] = useState(null);

  const battleId = battle?._id;

  // ================= RECONNECT =================
  useEffect(() => {
    if (!socket) return;

    const savedBattleId =
      battleId || localStorage.getItem("activeBattleId");

    if (!savedBattleId) return;

    socket.emit("battle:reconnect", { battleId: savedBattleId });

    socket.on("battle:resume", (battleData) => {
      setBattle(battleData);
      setStatus("active");
    });

    return () => {
      socket.off("battle:resume");
    };
  }, [socket, battleId]);

  // ================= STORE BATTLE =================
  useEffect(() => {
    if (battleId) {
      localStorage.setItem("activeBattleId", battleId);
    }
  }, [battleId]);

  // ================= SOCKET EVENTS =================
  useEffect(() => {
    if (!socket) return;

    const total = battle.question.testCases.length;

    socket.on("battle:update", ({ userId, passedCount }) => {
      if (userId === user._id) {
        setYourProgress((passedCount / total) * 100);
          } else {
        setOpponentProgress((passedCount / total) * 100);
      }
      setIsSubmitting(false);
    });

    socket.on("battle:ended", (res) => {
      setResult(res);
      setStatus("finished");
      setIsSubmitting(false);
      localStorage.removeItem("activeBattleId");
    });

    return () => {
      socket.off("battle:update");
      socket.off("battle:ended");
    };
  }, [socket, user]);

  console.log("Battle object:", battle); // print battle for debugging
  // ================= RUN =================
  const runCode = async () => {
    if (!battle) return;

    try {
      const res = await api.post("/run", {
        problemId: battle.problemId,
        language,
        sourceCode: code,
      });

      console.log("Run response:", res.data);

      setRunResult(res.data);

      // IMPORTANT
      if (res.data.verdict === "ACCEPTED") {
        setCanSubmit(true);
      } else {
        setCanSubmit(false);
      }

    } catch (err) {
      console.error(err.response?.data || err.message);
      setCanSubmit(false);
    }
  };


  // ================= SUBMIT =================
  const submitCode = () => {
    if (!canSubmit || !battle) return;

    setIsSubmitting(true);

    socket.emit("battle:submit", {
      battleId: battle._id,
      sourceCode: code,
      language,
    });

    setCanSubmit(false);
  };

  // ================= SAFETY =================
  if (!battle && status !== "finished") {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-950 text-amber-400">
        Restoring Battle...
      </div>
    );
  }

  return (
    <div className="h-screen bg-neutral-950 text-neutral-100 grid grid-cols-[80px_1fr_420px] grid-rows-[80px_1fr_260px]">

      {/* HEADER */}
      <header className="col-span-3 flex items-center justify-between px-10 border-b border-neutral-800 bg-neutral-900">

        {/* Your Progress */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-400">You</span>
          <div className="w-64 h-2 bg-neutral-800 rounded">
            <div
              className="h-full bg-red-700 rounded transition-all duration-300"
              style={{ width: `${yourProgress}%` }}
            />
          </div>
        </div>

        {/* Timer */}
        <div className="text-2xl tracking-widest font-semibold text-amber-400">
          {status === "active" && battle?.timeLimit && (
            <Timer initialTime={battle.timeLimit} />
          )}
        </div>

        {/* Opponent Progress */}
        <div className="flex items-center gap-4">
          <div className="w-64 h-2 bg-neutral-800 rounded">
            <div
              className="h-full bg-neutral-600 rounded transition-all duration-300"
              style={{ width: `${opponentProgress}%` }}
            />
          </div>
          <span className="text-sm text-neutral-400">Opponent</span>
        </div>

      </header>

      {/* SIDEBAR */}
      <aside className="row-span-2 bg-neutral-900 border-r border-neutral-800 flex flex-col items-center pt-6 space-y-6">

        <div className="w-10 h-10 rounded-full bg-red-700 border-2 border-amber-400 flex items-center justify-center font-bold">
          {user?.warriorName?.charAt(0)}
        </div>

        <div className="w-10 h-10 rounded-full bg-neutral-700 border-2 border-neutral-500 flex items-center justify-center font-bold">
          {battle?.players?.find(
              p => p.userId?.toString() !== user?._id?.toString()
            )?.name?.charAt(0) || "O"}
        </div>

      </aside>

      {/* CODE RUNNER */}
      <main className="row-span-2 p-6 overflow-hidden">
        <div className="h-full rounded-lg border border-neutral-800 bg-neutral-900 p-4">

          {status === "active" && (
            <CodeRunner
              code={code}
              setCode={setCode}
              onRun={runCode}
              onSubmit={submitCode}
              canSubmit={canSubmit}
              language={language}
              setLanguage={setLanguage}
              isSubmitting={isSubmitting}
            />
          )}

          {status === "finished" && (
            <div className="text-center">
              <h2 className="text-2xl text-amber-400 mb-4">
                Battle Finished
              </h2>
              <p>
                {result?.winner === user?._id
                  ? "Victory!"
                  : "Defeat"}
              </p>
              <button
                onClick={() => navigate("/arena")}
                className="mt-4 px-4 py-2 bg-red-700 rounded"
              >
                Return to Dojo
              </button>
            </div>
          )}

        </div>
      </main>

      {/* QUESTION */}
      <section className="border-l border-b border-neutral-800 p-6 bg-neutral-900 overflow-y-auto">
        {battle && (
          <>
            <h2 className="text-xl font-semibold text-amber-400 mb-4">
              {battle.question.title}
            </h2>
            <p className="text-neutral-300 leading-relaxed">
              {battle.question.description}
            </p>
          </>
        )}
      </section>

      {/* TEST CASES */}
      <section className="border-l border-neutral-800 p-6 bg-neutral-950 overflow-y-auto">
        {battle?.question?.testCases?.map((tc, i) => (
          <div
            key={i}
            className="mb-4 p-3 rounded bg-neutral-900 border border-neutral-800 text-sm"
          >
            <div>
              <span className="text-neutral-400">Input:</span> {tc.input}
            </div>
            <div>
              <span className="text-neutral-400">Expected:</span> {tc.expectedOutput}
            </div>
          </div>
        ))}
      </section>

    </div>
  );
}
