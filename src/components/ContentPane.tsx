import { cn } from "@/lib/utils"

interface ContentPaneProps {
  canvasOpen: boolean
  onToggleCanvas: () => void
}

export function ContentPane({ canvasOpen, onToggleCanvas }: ContentPaneProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <h1 className="text-lg font-semibold text-primary">Budgeting</h1>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 text-sm">
            <span
              className={cn(
                "font-medium transition-colors",
                !canvasOpen ? "text-foreground" : "text-muted-foreground",
              )}
            >
              Content
            </span>
            <button
              onClick={onToggleCanvas}
              role="switch"
              aria-checked={canvasOpen}
              className={cn(
                "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none",
                canvasOpen ? "bg-primary" : "bg-input",
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform",
                  canvasOpen ? "translate-x-4" : "translate-x-0",
                )}
              />
            </button>
            <span
              className={cn(
                "font-medium transition-colors",
                canvasOpen ? "text-foreground" : "text-muted-foreground",
              )}
            >
              Canvas
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span>Objectives:</span>
            <span className="font-medium text-foreground">0/1</span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="h-7 w-7 rounded-full border border-border bg-muted" />
            <div className="h-7 w-7 rounded-full bg-foreground" />
          </div>

          <div className="rounded bg-foreground px-2 py-0.5">
            <span className="text-xs font-bold tracking-tight text-background">une</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 border-b border-border px-6 py-2.5">
        <span className="text-sm font-medium">Topic 1:</span>
        <span className="text-sm text-muted-foreground">Lessons 1–2</span>
        <div className="flex items-center gap-1">
          <div className="h-3.5 w-3.5 rounded-full border-2 border-primary bg-primary" />
          <div className="h-px w-5 bg-border" />
          <div className="h-3.5 w-3.5 rounded-full border-2 border-border bg-background" />
        </div>
      </div>

      <div className="relative flex items-center justify-between border-b border-border py-2.5 pr-6">
        <div className="absolute bottom-0 left-0 top-0 w-1 rounded-r-sm bg-primary" />
        <span className="pl-6 text-sm font-medium">Lesson 1: Introduction</span>
        <button className="text-xs text-primary underline-offset-2 hover:underline">Rate lesson</button>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-7">
        <h2 className="mb-3 text-2xl font-semibold">Welcome</h2>
        <div className="mb-4 h-px bg-border" />
        <p className="text-sm leading-relaxed text-muted-foreground">intro content</p>
      </div>
    </div>
  )
}
