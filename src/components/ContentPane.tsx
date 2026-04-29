import { useState } from "react"
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
  chatCollapsed: boolean
}

// Lessons completed in this mock — only the intro lesson is done
const COMPLETED_LESSONS = new Set([1])

const LESSONS = [
  {
    id: 1,
    title: "Introduction",
    heading: "Welcome",
    content:
      "Welcome to the first lesson on tracking expenses. Here we introduce the fundamental concepts of budgeting and why monitoring your spending is crucial for financial health. By the end of this lesson you'll understand why even small daily purchases matter in the bigger picture of your financial wellbeing.",
  },
  {
    id: 2,
    title: "Income & Fixed Costs",
    heading: "Understanding Your Income",
    content:
      "In this lesson we explore how to categorise your income sources and identify fixed costs — the recurring expenses that stay the same each month. Fixed costs such as rent, loan repayments, and subscriptions form the foundation of any solid budget because they are predictable and non-negotiable.",
  },
  {
    id: 3,
    title: "Variable Expenses",
    heading: "Managing Variable Spending",
    content:
      "Variable expenses fluctuate month to month. This lesson covers strategies to track and manage spending on groceries, entertainment, dining out, and other discretionary categories. You'll learn how to spot patterns in your variable spending and where small adjustments can make a big difference.",
  },
  {
    id: 4,
    title: "Building a Budget",
    heading: "Creating Your First Budget",
    content:
      "Put your knowledge into practice. We walk through building a simple monthly budget template, setting realistic spending targets for each category, and balancing your income against your outgoings. A well-constructed budget is a living document — we'll show you how to keep it up to date.",
  },
  {
    id: 5,
    title: "Review & Reflection",
    heading: "Staying on Track",
    content:
      "In the final lesson we review everything you've learned across this topic and discuss strategies for staying on track with your budget over the long term. Consistency is key — small, regular check-ins with your finances will always outperform occasional deep dives.",
  },
]

export function ContentPane({
  canvasOpen,
  onToggleCanvas,
  mapOpen,
  onToggleMap,
  chatCollapsed,
}: ContentPaneProps) {
  const [currentLesson, setCurrentLesson] = useState(1)

  const lesson = LESSONS[currentLesson - 1]

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
      {/* Header — always visible */}
      <div className={cn("flex items-center justify-between px-8 py-4", chatCollapsed && "pl-12")}>
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

          {!mapOpen && (
            <div className="rounded bg-card-foreground px-2 py-0.5">
              <span className="text-xs font-bold tracking-tight text-card">
                une
              </span>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Lesson content */}
      <ScrollArea className={cn("flex-1", mapOpen && "hidden")}>
      {/* Breadcrumb bar — hairline bottom border, scrolls with content */}
      <div className="border-b border-border/40 px-8 pb-3 pt-2.5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {/* Left: two-row column — Rate lesson centres against its full height */}
          <div className="flex flex-1 flex-col gap-1.5">
            {/* Row 1: full breadcrumb trail on one line */}
            <div className="flex items-center gap-2">
              <span className="shrink-0 font-medium text-foreground">Topic 1: Tracking Expenses</span>

              <ChevronRight className="size-3 shrink-0" />

              <span className="font-medium text-foreground">
                Lesson {currentLesson}: {lesson.title}
              </span>

              <ChevronRight className="size-3 shrink-0" />

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
            </div>

            {/* Row 2: dots indented to the lesson label via an invisible spacer that
                mirrors the topic prefix width — no hardcoded values needed */}
            <div className="flex items-center gap-2">
              <span className="invisible shrink-0 font-medium" aria-hidden="true">
                Topic 1: Tracking Expenses
              </span>
              <ChevronRight className="invisible size-3 shrink-0" aria-hidden="true" />

              <div className="flex items-center gap-1.5">
                {LESSONS.map((l, i) => {
                  const isCompleted = COMPLETED_LESSONS.has(l.id)
                  const isCurrent = l.id === currentLesson
                  const prevCompleted = i > 0 && COMPLETED_LESSONS.has(LESSONS[i - 1].id)

                  return (
                    <div key={l.id} className="flex items-center">
                      {i > 0 && (
                        <div
                          className={cn(
                            "h-px w-3 mr-0.5",
                            prevCompleted ? "bg-primary" : "bg-border",
                          )}
                        />
                      )}
                      <button
                        onClick={() => setCurrentLesson(l.id)}
                        title={`Lesson ${l.id}: ${l.title}`}
                        className={cn(
                          "h-2.5 w-2.5 rounded-full border-2 transition-all hover:scale-110 focus-visible:outline-none",
                          isCompleted
                            ? "border-primary bg-primary cursor-pointer"
                            : isCurrent
                              ? "border-foreground bg-background cursor-default"
                              : "border-border bg-background cursor-pointer hover:border-muted-foreground",
                          isCurrent && isCompleted && "ring-2 ring-foreground ring-offset-1 ring-offset-background",
                        )}
                        aria-current={isCurrent ? "step" : undefined}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <Button variant="link" size="sm" className="ml-auto h-auto self-center p-0">
            Rate lesson
          </Button>
        </div>
      </div>

        <div className="px-8 py-8">
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            {lesson.heading}
          </h2>
          <Separator className="mb-5" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            {lesson.content}
          </p>
        </div>
      </ScrollArea>

      {/* Course navigator */}
      <div className={cn("flex min-h-0 flex-1 flex-col overflow-hidden pt-6", !mapOpen && "hidden")}>
        <h2 className="mb-4 px-8 text-lg font-semibold text-foreground">
          Course Map
        </h2>
        <CourseNavigator onTopicSelect={onToggleMap} />
      </div>
    </div>
  )
}
