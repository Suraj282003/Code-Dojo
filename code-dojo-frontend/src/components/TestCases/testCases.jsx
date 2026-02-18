"use client"

import { useState } from "react"
import { CheckCircle2, XCircle, AlertTriangle, Lock } from "lucide-react"

export function TestCases({ testCases = [], runResult }) {
  const [activeTab, setActiveTab] = useState(0)

  if (!testCases.length) {
    return (
      <div className="rounded-lg border bg-card p-4 text-muted-foreground">
        No test cases available
      </div>
    )
  }

  const results = runResult?.results || []

  const activeTest = testCases[activeTab]
  const activeResult = results[activeTab]

  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-card">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-border p-2">
        {testCases.map((tc, index) => {
          const result = results[index]

          return (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`flex items-center gap-2 rounded px-3 py-1.5 text-sm transition-colors ${
                activeTab === index
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tc.isHidden && <Lock className="h-3 w-3" />}
              Test {index + 1}

              {result?.passed && (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
              {result && !result.passed && (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-4 p-4 overflow-auto">
        {/* Input */}
        <Block
          title="Input"
          value={
            activeTest.isHidden
              ? "Hidden test case"
              : activeTest.input
          }
          hidden={activeTest.isHidden}
        />

        {/* Expected Output */}
        {!activeTest.isHidden && (
          <Block
            title="Expected Output"
            value={activeTest.expectedOutput}
          />
        )}

        {/* Actual Output */}
        {activeResult && !activeTest.isHidden && (
          <Block
            title="Your Output"
            value={activeResult.output || "(no output)"}
            success={activeResult.passed}
          />
        )}

        {/* Compile / Runtime Error */}
        {runResult?.error && (
          <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500">
            <div className="mb-1 flex items-center gap-2 font-medium">
              <AlertTriangle className="h-4 w-4" /> Error
            </div>
            <pre className="whitespace-pre-wrap font-mono">
              {runResult.error}
            </pre>
          </div>
        )}

        {/* Hidden testcase result summary */}
        {activeTest.isHidden && activeResult && (
          <div
            className={`flex items-center gap-2 rounded p-3 ${
              activeResult.passed
                ? "bg-green-500/10 text-green-600"
                : "bg-red-500/10 text-red-500"
            }`}
          >
            {activeResult.passed ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            <span className="font-medium">
              {activeResult.passed ? "Passed" : "Failed"}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

function Block({ title, value, success, hidden }) {
  return (
    <div>
      <div className="mb-1 text-xs font-medium text-muted-foreground">
        {title}
      </div>
      <pre
        className={`rounded p-3 font-mono text-sm whitespace-pre-wrap ${
          hidden
            ? "bg-muted text-muted-foreground"
            : success === undefined
            ? "bg-muted"
            : success
            ? "bg-green-500/10 text-green-600"
            : "bg-red-500/10 text-red-500"
        }`}
      >
        {value}
      </pre>
    </div>
  )
}
