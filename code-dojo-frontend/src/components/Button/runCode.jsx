"use client"

import { Play, Loader2 } from "lucide-react"

export function RunCodeButton({ onClick, isRunning = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isRunning}
      className={`flex items-center gap-2 rounded px-4 py-2 text-sm font-medium transition-colors
        ${
          isRunning
            ? "cursor-not-allowed bg-primary/60"
            : "bg-primary hover:bg-primary/90"
        }
      `}
    >
      {isRunning ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Play className="h-4 w-4" />
      )}

      {isRunning ? "Running..." : "Run Code"}
    </button>
  )
}
