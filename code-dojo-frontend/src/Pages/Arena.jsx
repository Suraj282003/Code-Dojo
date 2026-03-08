import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { CodeRunner } from "../components/CodeRunner/coderunner";
import { Timer } from "../components/Timer/ArenaTimer";
import { useSocket } from "../context/socketContext";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { TestCases } from "../components/TestCases/testCases";
import { QuestionBlock } from "../components/Questions/question";

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

    socket.on("battle:ended", (res) => {
      setIsSubmitting(false);
      setStatus("finished");

      navigate("/battle-result", {
        state: { result: res },
        replace: true,
      });
      localStorage.removeItem("activeBattleId");
      localStorage.removeItem("battleStatus");
    });

    return () => {
      socket.off("battle:resume");
      socket.off("battle:ended");
    };
  }, [socket, battleId, navigate, user]);

  // ================= STORE ACTIVE BATTLE =================
  useEffect(() => {
    if (battleId) {
      localStorage.setItem("activeBattleId", battleId);
    }
  }, [battleId]);

  // ================= SOCKET EVENTS =================
  useEffect(() => {
    if (!socket || !battle) return;

    socket.on("battle:update", (data) => {
      const { userId, passedCount, results, error } = data;

      const total = battle.question?.testCases?.length || 1;
      const percent = (passedCount / total) * 100;

      if (userId === user.id) {
        setYourProgress(percent);
        setRunResult({ results, error });
      } else {
        setOpponentProgress(percent);
      }

      setIsSubmitting(false);
    });

    return () => {
      socket.off("battle:update");
    };
  }, [socket, battle, user]);

  // ================= RUN CODE =================
  const runCode = async () => {
    if (!battle) return;

    try {
      const res = await api.post("/run", {
        problemId: battle.problemId,
        language,
        sourceCode: code,
      });

      setRunResult(res.data);

      if (res.data.verdict === "ACCEPTED") {
        setCanSubmit(true);
      } else {
        setCanSubmit(false);
      }
    } catch (err) {
      setRunResult({
        error: err.response?.data?.error || err.message,
      });
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

  if (!battle) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-950 text-amber-400">
        Restoring Battle...
      </div>
    );
  }

  return (
  <div className="h-screen bg-neutral-950 text-neutral-100 grid grid-cols-[1.6fr_1fr] grid-rows-[80px_1fr_260px]">

    {/* HEADER */}
    <header className="col-span-2 flex items-center justify-between px-10 border-b border-neutral-800 bg-neutral-900">

      {/* YOUR PROGRESS */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-neutral-400">You</span>
        <div className="w-64 h-2 bg-neutral-800 rounded">
          <div
            className="h-full bg-red-700 rounded transition-all duration-300"
            style={{ width: `${yourProgress}%` }}
          />
        </div>
      </div>

      {/* TIMER */}
      <div className="text-2xl tracking-widest font-semibold text-amber-400">
        {status === "active" && battle?.startedAt && battle?.timeLimit && (
          <Timer
            endTime={
              new Date(battle.startedAt).getTime() +
              battle.timeLimit * 1000
            }
          />
        )}
      </div>

      {/* OPPONENT PROGRESS */}
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

    {/* CODE EDITOR */}
    <main className="row-span-2 p-4">
      <div className="h-full rounded-lg border border-neutral-800 bg-neutral-900 overflow-hidden">
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
      </div>
    </main>

    {/* QUESTION PANEL */}
    <section className="border-l border-b border-neutral-800 bg-neutral-900 overflow-hidden">
      <QuestionBlock problem={battle.question} />
    </section>

    {/* TEST CASES */}
    <section className="border-l border-neutral-800 bg-neutral-950 overflow-y-auto">
      <TestCases
        testCases={battle.question.testCases}
        runResult={runResult}
      />
    </section>

  </div>
);
}