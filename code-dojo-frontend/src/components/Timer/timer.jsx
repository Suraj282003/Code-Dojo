"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"

export function Timer({ timeRemaining, onTimeUp, enabled }) {
  const [time, setTime] = useState(timeRemaining)
  const [started, setStarted] = useState(false)

  // sync with backend updates
  useEffect(() => {
    setTime(timeRemaining)
  }, [timeRemaining])

  // countdown
  useEffect(() => {
    if (!started && time > 0) {
      setStarted(true)
      return
    }

    if (!started) return
    if (!enabled) return
    if (time <= 0) {
      onTimeUp?.()
      return
    }

  const interval = setInterval(() => {
    setTime(t => t - 1)
  }, 1000)

  return () => clearInterval(interval)
}, [time, started, enabled, onTimeUp])


  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
      <Clock className="h-5 w-5 text-muted-foreground" />
      <span
        className={`font-mono text-xl font-semibold tabular-nums ${
          time <= 10 ? "text-destructive" : ""
        }`}
      >
        {formatTime(time)}
      </span>
    </div>
  )
}
