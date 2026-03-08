import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../api/axios"
import Navbar from "../components/Navigation/NavBar";

import { CodeRunner } from "../components/CodeRunner/coderunner"
import { Timer } from "../components/Timer/timer"
import { TestCases } from "../components/TestCases/testCases"
import { QuestionBlock } from "../components/Questions/question"
import { CompletedScreen } from "../components/Completed/complete"
import { useAuth } from "../context/AuthContext"

export default function Survival() {
  const { runId } = useParams()

  const [language, setLanguage] = useState("javascript")
  const [problem, setProblem] = useState(null)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [code, setCode] = useState("")
  const [runResult, setRunResult] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timeUp, setTimeUp] = useState(false)
  const [completed, setCompleted] = useState(false)
  const { isAuthenticated, loading } = useAuth()


  const navigate = useNavigate()

  // load challenge + problem
  useEffect(() => {
    const loadRun = async () => {
      const runRes = await api.get(`/challenge/${runId}/current`)
      const remaining = runRes.data.timeRemaining
      setTimeRemaining(remaining)

      if (remaining <= 0) {
        setTimeUp(true)
        return
      }

      const problemRes = await api.get(`/problems/${runRes.data.problemId}`)
      setProblem(problemRes.data)
    }
    loadRun()
  }, [runId])

  useEffect(() => {
  if (!loading && !isAuthenticated) {
    navigate("/login");
  }
}, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    setTimeUp(false)
  }, [runId])

  const runCode = async () => {
    if (!problem || timeUp) return
    const res = await api.post("/run", {
      problemId: problem._id,
      language,
      sourceCode: code,
    })
    setRunResult(res.data)
  }

  const submitCode = async () => {
    if (!problem || timeUp) return
    setIsSubmitting(true)
    try {
      const res = await api.post(`/challenge/${runId}/submit`, {
        problemId: problem._id,
        language,
        sourceCode: code,
      })

      if (res.data.status === "NEXT") {
        setTimeRemaining(res.data.timeRemaining)
        const next = await api.get(`/problems/${res.data.nextProblemId}`)
        setProblem(next.data)
        setCode("")
        setRunResult(null)
      }

      if (res.data.status === "COMPLETED") {
          setCompleted(true)
          return
        }

    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTimeUp = () => {
    if (timeUp) return
    setTimeUp(true)

    setTimeout(() => {
      navigate("/")
    }, 3000)
  }

  const canSubmit =
    runResult &&
    runResult.results?.length > 0 &&
    runResult.results.every((t) => t.passed)

  if (problem === null) return null

  if (completed) {
  return (
    <CompletedScreen
      onContinue={() => navigate("/")}
    />
  )
}


  if (timeUp) {
    return (
      <div className="relative flex h-screen items-center justify-center overflow-hidden bg-emerald-900">
        <div className="absolute inset-0 bg-black/40" />

        {/* floating leaves */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[...Array(16)].map((_, i) => (
            <span
              key={i}
              className="absolute top-[-10%] text-green-300 opacity-70 animate-leaf"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.8}s`,
                fontSize: `${14 + Math.random() * 16}px`,
              }}
            >
              🍃
            </span>
          ))}
        </div>

        <div className="relative z-10 rounded-xl border border-white/20 bg-emerald-800/80 p-10 text-center shadow-2xl backdrop-blur">
          <h1 className="mb-4 text-4xl font-bold text-green-200">⏰ TIME’S UP</h1>
          <p className="text-green-100/80">Redirecting to categories…</p>
        </div>

        <style>{`
          @keyframes leaf {
            0% { transform: translateY(-10%) rotate(0deg); opacity: 0 }
            10% { opacity: .7 }
            100% { transform: translateY(120vh) rotate(360deg); opacity: 0 }
          }
          .animate-leaf { animation: leaf 12s linear infinite; }
        `}</style>
      </div>
    )
  }

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-emerald-950 text-white font-semibold">
      {/* background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1502082553048-f009c37129b9')",
        }}
      />
      <div className="absolute inset-0 bg-black/50" />

      {/* floating leaves */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(18)].map((_, i) => (
          <span
            key={i}
            className="absolute top-[-10%] text-green-300 opacity-60 animate-leaf"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.9}s`,
              fontSize: `${12 + Math.random() * 18}px`,
            }}
          >
            🍃
          </span>
        ))}
      </div>
{/* 🥷 GLOBAL NAVBAR (TRANSPARENT) */}
    <div className="relative z-20">
      <Navbar />
    </div>

    {/* TIMER SECTION (same position feel) */}
    <div className="relative z-20 flex items-center justify-center border-b border-white/20 px-6 py-3">
      {timeRemaining > 0 && !timeUp && (
        <Timer
          timeRemaining={timeRemaining}
          onTimeUp={handleTimeUp}
          enabled={isAuthenticated}
        />
      )}
    </div>

      {/* MAIN LAYOUT */}
      <div className="relative z-10 flex flex-1 overflow-hidden">
        {/* LEFT */}
        <div className="w-1/2 border-r border-white/20 p-4">
          <CodeRunner
            code={code}
            setCode={setCode}
            onRun={runCode}
            onSubmit={submitCode}
            canSubmit={canSubmit}
            language={language}
            setLanguage={setLanguage}
            isSubmitting={isSubmitting}
            isAuthenticated={isAuthenticated}
          />
        </div>

        {/* RIGHT */}
        <div className="flex w-1/2 flex-col">
          <div className="h-1/2 overflow-auto border-b border-white/20 p-4">
            <QuestionBlock problem={problem} />
          </div>
          <div className="h-1/2 overflow-auto p-4">
            <TestCases
              testCases={problem?.sampleTestCases || []}
              runResult={runResult}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes leaf {
          0% { transform: translateY(-10%) rotate(0deg); opacity: 0 }
          10% { opacity: .6 }
          100% { transform: translateY(120vh) rotate(360deg); opacity: 0 }
        }
        .animate-leaf { animation: leaf 14s linear infinite; }
      `}</style>
    </div>
  )
}
