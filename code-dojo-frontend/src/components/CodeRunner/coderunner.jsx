"use client"

import { useState } from "react"
import { RunCodeButton } from "../Button/runCode"
import { Maximize2, Minimize2, Sun, Moon } from "lucide-react"
import Editor from "@monaco-editor/react"

export function CodeRunner({
  code,
  setCode,
  onRun,
  onSubmit,
  canSubmit,
  language,
  setLanguage,
  isSubmitting,
}) {
  const [isRunning, setIsRunning] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [theme, setTheme] = useState("dark") // 🌗 light / dark

  const handleRun = async () => {
    if (isRunning || isSubmitting) return
    try {
      setIsRunning(true)
      await onRun()
    } finally {
      setIsRunning(false)
    }
  }

  const handleSubmit = async () => {
    if (isRunning || isSubmitting || !canSubmit) return
    await onSubmit()
  }

  const editorTheme = theme === "dark" ? "vs-dark" : "vs"

  return (
    <div
      className={`flex flex-col border border-white/20 backdrop-blur transition-all ${
        fullscreen
          ? "absolute inset-0 z-40 bg-emerald-950"
          : "relative h-full bg-emerald-900/40"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/20 px-3 py-2 text-white">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold tracking-wide">Solution</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded border border-white/30 bg-black/30 px-2 py-1 text-xs text-white"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {/* 🌗 Theme toggle */}
          <button
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            className="rounded p-1 hover:bg-white/10"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Fullscreen */}
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="rounded p-1 hover:bg-white/10"
          >
            {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          <RunCodeButton onClick={handleRun} isRunning={isRunning} />
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          theme={editorTheme}
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{
            fontSize: 14,
            fontFamily:
              "JetBrains Mono, Fira Code, Menlo, Monaco, Consolas, monospace",
            minimap: { enabled: false },
            lineNumbers: "on",
            automaticLayout: true,
            scrollBeyondLastLine: false,
          }}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/20 bg-black/20 px-4 py-2 text-xs text-white">
        <span className="opacity-80">Language: {language}</span>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
          className={`rounded px-4 py-1 text-sm font-bold transition-colors ${
            canSubmit
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-500 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  )
}
