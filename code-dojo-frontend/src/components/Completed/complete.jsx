"use client"

import { CheckCircle2 } from "lucide-react"

export function CompletedScreen({ onContinue }) {
  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden bg-emerald-950 text-white">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Floating leaves */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(18)].map((_, i) => (
          <span
            key={i}
            className="absolute top-[-10%] text-green-300 opacity-70 animate-leaf"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.8}s`,
              fontSize: `${14 + Math.random() * 18}px`,
            }}
          >
            🍃
          </span>
        ))}
      </div>

      {/* Card */}
      <div className="relative z-10 rounded-2xl border border-white/20 bg-emerald-900/80 p-12 text-center shadow-2xl backdrop-blur">
        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-400" />
        <h1 className="mb-3 text-4xl font-extrabold text-white">
          Challenge Completed
        </h1>
        <p className="mb-8 text-white/80">
          You’ve successfully completed all problems in this category.
        </p>

        <button
          onClick={onContinue}
          className="rounded-xl bg-green-600 px-8 py-3 text-lg font-bold text-white hover:bg-green-700 transition-colors"
        >
          Back to Categories
        </button>
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
