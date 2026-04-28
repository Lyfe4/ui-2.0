import { ArrowLeft, ChevronRight, LayoutList } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { CourseNavigator } from "@/components/CourseNavigator"

interface ContentPaneProps {
  canvasOpen: boolean
  onToggleCanvas: () => void
  mapOpen: boolean
  onToggleMap: () => void
}

export function ContentPane({
  canvasOpen,
  onToggleCanvas,
  mapOpen,
  onToggleMap,
}: ContentPaneProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
      {/* Header — always visible */}
      <div className="flex items-center justify-between px-8 py-4">
        {mapOpen ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleMap}
            className="gap-2 text-muted-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to lesson
          </Button>
        ) : (
          <h1 className="text-base font-semibold text-primary">Budgeting</h1>
        )}

        <div className="flex items-center gap-4">
          {!mapOpen && (
            <>
              <div className="flex items-center gap-2 text-sm">
                <span
                  className={cn(
                    "transition-colors",
                    !canvasOpen
                      ? "font-medium text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  Content
                </span>
                <button
                  onClick={onToggleCanvas}
                  role="switch"
                  aria-checked={canvasOpen}
                  className={cn(
                    "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    canvasOpen ? "bg-primary" : "bg-border",
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
                    "transition-colors",
                    canvasOpen
                      ? "font-medium text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  Canvas
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="h-7 w-7 rounded-full bg-muted" />
                <div className="h-7 w-7 rounded-full bg-muted-foreground" />
              </div>

              <div className="rounded bg-card-foreground px-2 py-0.5">
                <span className="text-xs font-bold tracking-tight text-card">
                  une
                </span>
              </div>
            </>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleMap}
            aria-pressed={mapOpen}
            className={cn(
              "gap-1.5",
              mapOpen && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
            )}
          >
            <LayoutList className="size-4" />
            {!mapOpen && "Course Map"}
          </Button>
        </div>
      </div>

      <Separator />

      {/* Lesson content — always mounted, hidden when map is open */}
      <ScrollArea className={cn("flex-1", mapOpen && "hidden")}>
        <div className="px-8 py-7">
          <div className="mb-8 flex items-center gap-2 text-xs text-muted-foreground">
            {/* Topic count + name */}
            <span className="shrink-0 font-medium text-foreground">Topic 1: Tracking Expenses</span>

            <ChevronRight className="size-3 shrink-0 text-muted-foreground" />

            {/* Current lesson name + dots grouped */}
            <div className="flex shrink-0 items-center gap-1.5">
              <span className="font-medium text-foreground">Lesson 1: Introduction</span>
              <div className="flex items-center gap-1">
                <div className="h-2.5 w-2.5 rounded-full border-2 border-primary bg-primary" />
                <div className="h-px w-3 bg-border" />
                <div className="h-2.5 w-2.5 rounded-full border-2 border-border bg-background" />
                <div className="h-px w-3 bg-border" />
                <div className="h-2.5 w-2.5 rounded-full border-2 border-border bg-background" />
                <div className="h-px w-3 bg-border" />
                <div className="h-2.5 w-2.5 rounded-full border-2 border-border bg-background" />
                <div className="h-px w-3 bg-border" />
                <div className="h-2.5 w-2.5 rounded-full border-2 border-border bg-background" />
              </div>
            </div>

            <ChevronRight className="size-3 shrink-0 text-muted-foreground" />

            {/* Learning objective dot — one per lesson, tooltip on hover */}
            <div className="group/objective relative flex shrink-0 items-center gap-1">
              <span className="text-xs text-muted-foreground">LO:</span>
              <div className="h-2.5 w-2.5 cursor-default rounded-full border-2 border-border bg-background" />
              <div className="pointer-events-none absolute left-0 top-full z-50 mt-2 hidden w-max group-hover/objective:block">
                <div className="rounded-md border border-border bg-popover px-3 py-2 shadow-md">
                  <p className="text-xs font-medium text-popover-foreground">
                    Understand budgeting basics
                  </p>
                  <p className="mt-0.5 min-h-[1em] text-[11px] text-muted-foreground" />
                </div>
              </div>
            </div>

            <Button variant="link" size="sm" className="ml-auto h-auto p-0">
              Rate lesson
            </Button>
          </div>

          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            Welcome
          </h2>
          <Separator className="mb-5" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            intro content
          </p>
        </div>
      </ScrollArea>

      {/* Course navigator — always mounted, hidden when map is closed */}
      <div className={cn("flex-1 overflow-hidden py-6", !mapOpen && "hidden")}>
        <div className="mx-auto flex h-full max-w-2xl flex-col">
          <h2 className="mb-4 px-6 text-lg font-semibold text-foreground">
            Course Map
          </h2>
          <div className="flex-1 overflow-hidden">
            <CourseNavigator onTopicSelect={onToggleMap} />
          </div>
        </div>
      </div>
    </div>
  )
}
