import { useState } from "react"
import { ArrowLeft, ChevronLeft, ChevronRight, ClipboardList, LayoutList, PanelRight } from "lucide-react"
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
  onOpenSubmission?: () => void
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
  onOpenSubmission,
}: ContentPaneProps) {
  const [currentLesson, setCurrentLesson] = useState(1)

  const lesson = LESSONS[currentLesson - 1]

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
      {/* Header — always visible */}
      <div className={cn("flex items-center justify-between px-4 py-4 sm:px-8", chatCollapsed && "pl-16")}>
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
          <h1 className="text-xl font-semibold text-primary">Budgeting</h1>
        )}

        <div className="flex items-center gap-4">
          {!mapOpen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCanvas}
              aria-pressed={canvasOpen}
              className={cn(
                "gap-1.5",
                canvasOpen && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
              )}
            >
              <PanelRight className="size-4" />
              {!canvasOpen && "Canvas"}
            </Button>
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

      {/* Breadcrumb bar — sticky, faint muted background, blurs content beneath */}
      <div className={cn("bg-muted/40 backdrop-blur-sm px-4 sm:px-8 py-2.5 rounded-b-xl", mapOpen && "hidden")}>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-muted-foreground">
          <span className="shrink-0 font-medium text-foreground">Topic 1: Tracking Expenses</span>

          <ChevronRight className="size-3 shrink-0" />

          <span className="shrink-0 font-medium text-foreground">
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

          <div className="relative ml-auto">
            <span className="absolute -right-0.5 -top-0.5 flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            <Button
              variant="ghost"
              size="xs"
              className="gap-1 bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
              onClick={onOpenSubmission}
            >
              <ClipboardList className="size-3" />
              Submit Assessment
            </Button>
          </div>

        </div>
      </div>

      {/* Lesson content */}
      <ScrollArea className={cn("flex-1", mapOpen && "hidden")}>
        <div className="px-4 py-8 sm:px-8">
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            {lesson.heading}
          </h2>
          <Separator className="mb-5" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            {lesson.content}
          </p>
        </div>
      </ScrollArea>

      {/* Lesson navigation bar */}
      {!mapOpen && (
        <div className="flex items-center justify-between border-t border-border/60 bg-background px-4 py-3 sm:px-8">
          <button
            onClick={() => setCurrentLesson((n) => Math.max(1, n - 1))}
            disabled={currentLesson === 1}
            className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-none"
          >
            <ChevronLeft className="size-3.5" />
            Prev
          </button>

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
                        "h-px w-4 mr-0.5",
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

          <div className="flex items-center gap-4">
            <Button variant="link" size="sm" className="h-auto p-0 text-xs">
              Rate lesson
            </Button>
            <button
              onClick={() => setCurrentLesson((n) => Math.min(LESSONS.length, n + 1))}
              disabled={currentLesson === LESSONS.length}
              className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-none"
            >
              Next
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Course navigator */}
      <div className={cn("flex min-h-0 flex-1 flex-col overflow-hidden pt-6", !mapOpen && "hidden")}>
        <h2 className="mb-4 px-4 sm:px-8 text-lg font-semibold text-foreground">
          Course Map
        </h2>
        <CourseNavigator onTopicSelect={onToggleMap} />
      </div>
    </div>
  )
}
