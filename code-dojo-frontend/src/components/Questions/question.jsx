import { FileText, BookOpen, Users, ChevronDown } from "lucide-react"

const difficultyStyles = {
  Easy: {
    badge: "border-green-500/40 bg-green-500/10 text-green-400",
    dot: "bg-green-400",
  },
  Medium: {
    badge: "border-yellow-500/40 bg-yellow-500/10 text-yellow-400",
    dot: "bg-yellow-400",
  },
  Hard: {
    badge: "border-red-500/40 bg-red-500/10 text-red-400",
    dot: "bg-red-400",
  },
}

export function QuestionBlock({ problem }) {
  if (!problem) {
    return (
      <div className="p-4 text-muted-foreground">
        Loading problem...
      </div>
    )
  }

  const level = difficultyStyles[problem.difficulty] || difficultyStyles.Easy

  return (
    <div className="flex h-full flex-col rounded-lg border border-white/20 bg-black/20 backdrop-blur">
      {/* Header */}
      <div className="border-b border-white/20 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-white" />
          <h2 className="text-lg font-bold text-white">
            {problem.title}
          </h2>
        </div>

        {/* Difficulty Badge */}
        <div
          className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${level.badge}`}
        >
          <span className={`inline-block h-2 w-2 rounded-full ${level.dot}`} />
          {problem.difficulty}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6 p-4">
          {/* Tabs */}
          <div className="flex items-center justify-between border-b border-white/20 pb-2">
            <div className="flex items-center gap-4 text-sm">
              <button className="inline-flex items-center gap-1 rounded-md bg-white/10 px-3 py-1.5 text-white">
                <FileText className="h-4 w-4" />
                Description
              </button>
              <button className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-white/60 hover:bg-white/10">
                <BookOpen className="h-4 w-4" />
                Editorial
              </button>
              <button className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-white/60 hover:bg-white/10">
                <Users className="h-4 w-4" />
                Solutions
              </button>
            </div>
            <button className="flex items-center gap-1 text-xs text-white/60 hover:text-white">
              More
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <p className="leading-relaxed text-white whitespace-pre-line">
              {problem.description}
            </p>

            <div className="h-px w-full bg-white/20" />

            {/* Sample Test Cases */}
            <div className="space-y-4">
              <h3 className="font-bold text-white">Sample Test Cases</h3>

              {problem.sampleTestCases?.map((tc, index) => (
                <div
                  key={index}
                  className="space-y-2 rounded-lg bg-white/10 p-4"
                >
                  <div>
                    <span className="text-sm font-bold text-white/70">
                      Input:
                    </span>
                    <pre className="mt-1 font-mono text-sm text-white">
                      {tc.input}
                    </pre>
                  </div>

                  <div>
                    <span className="text-sm font-bold text-white/70">
                      Output:
                    </span>
                    <pre className="mt-1 font-mono text-sm text-white">
                      {tc.expectedOutput}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
