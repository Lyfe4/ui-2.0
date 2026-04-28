import { cn } from "@/lib/utils"

interface ContentPaneProps {
  canvasOpen: boolean
  onToggleCanvas: () => void
}

export function ContentPane({ canvasOpen, onToggleCanvas }: ContentPaneProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-white">
      <div className="flex items-center justify-between border-b border-zinc-100 px-8 py-4">
        <h1 className="text-base font-semibold text-primary">Budgeting</h1>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 text-sm">
            <span className={cn("transition-colors", !canvasOpen ? "font-medium text-zinc-800" : "text-zinc-400")}>
              Content
            </span>
            <button
              onClick={onToggleCanvas}
              role="switch"
              aria-checked={canvasOpen}
              className={cn(
                "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none",
                canvasOpen ? "bg-primary" : "bg-zinc-200",
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform",
                  canvasOpen ? "translate-x-4" : "translate-x-0",
                )}
              />
            </button>
            <span className={cn("transition-colors", canvasOpen ? "font-medium text-zinc-800" : "text-zinc-400")}>
              Canvas
            </span>
          </div>

          <span className="text-sm text-zinc-400">
            Objectives: <span className="font-medium text-zinc-700">0/1</span>
          </span>

          <div className="flex items-center gap-1.5">
            <div className="h-7 w-7 rounded-full bg-zinc-200" />
            <div className="h-7 w-7 rounded-full bg-zinc-800" />
          </div>

          <div className="rounded bg-zinc-900 px-2 py-0.5">
            <span className="text-xs font-bold tracking-tight text-white">une</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-7">
        <div className="mb-8 flex items-center gap-2.5 text-xs text-zinc-400">
          <span>Topic 1</span>
          <span>·</span>
          <div className="flex items-center gap-1">
            <div className="h-2.5 w-2.5 rounded-full border-2 border-primary bg-primary" />
            <div className="h-px w-4 bg-zinc-200" />
            <div className="h-2.5 w-2.5 rounded-full border-2 border-zinc-300 bg-white" />
          </div>
          <span>Lessons 1–2</span>
          <span>·</span>
          <span className="font-medium text-zinc-600">Lesson 1: Introduction</span>
          <button className="ml-auto text-primary underline-offset-2 hover:underline">
            Rate lesson
          </button>
        </div>

        <h2 className="mb-3 text-2xl font-semibold text-zinc-900">Welcome</h2>
        <div className="mb-5 h-px bg-zinc-100" />
        <p className="text-sm leading-relaxed text-zinc-500">intro content</p>
      </div>
    </div>
  )
}
