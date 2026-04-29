import { useState } from "react"
import { ArrowLeft, Check, ChevronRight, LayoutList } from "lucide-react"
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

const LESSONS = [
  {
    title: "Introduction",
    heading: "Welcome to Budgeting",
    content: `Budgeting is the foundation of financial wellbeing. In this topic, you'll learn how to track where your money goes, identify patterns in your spending, and make intentional decisions about your finances.

A budget isn't about restriction — it's about clarity. When you know exactly what's coming in and going out, you're in control. You decide what matters most to you and allocate your money accordingly.

By the end of this topic, you'll be able to build a simple budget from scratch, categorise your expenses, and spot areas where small changes can make a big difference over time.`,
  },
  {
    title: "Income & Expenses",
    heading: "Mapping Your Money Flow",
    content: `Every budget starts with two numbers: what you earn and what you spend. This lesson walks you through how to capture both accurately.

Income isn't just your salary — it can include casual work, government payments, scholarships, or any other regular inflow. Listing all sources gives you a true picture of what you have to work with.

Expenses fall into two broad buckets: fixed costs that don't change month to month (rent, subscriptions, loan repayments) and variable costs that fluctuate (groceries, transport, entertainment). Separating them helps you see which parts of your budget have flexibility.`,
  },
  {
    title: "Categorising Spend",
    heading: "Finding Patterns in Your Spending",
    content: `Once you've listed your expenses, grouping them into categories reveals patterns that individual line items hide. Common categories include housing, food, transport, health, entertainment, and savings.

There's no single right way to categorise — what matters is that the categories are meaningful to you. Some people go broad (10–12 categories), others go granular (30+). Start broad and add detail where you want more visibility.

Try categorising your last month of transactions. You may be surprised by where most of your discretionary spending lands — that surprise is valuable data.`,
  },
  {
    title: "Setting Targets",
    heading: "Deciding Where Your Money Should Go",
    content: `A budget only becomes useful when you attach targets to your categories. Targets turn a spending record into a spending plan.

A common starting framework is the 50/30/20 rule: roughly 50% of after-tax income on needs, 30% on wants, and 20% on savings and debt repayment. It's a guideline, not a rule — adjust it to reflect your actual priorities and obligations.

Set targets that are realistic, not aspirational. An overly tight budget is harder to stick to than a slightly generous one. You can always tighten it once you have a few months of data.`,
  },
  {
    title: "Review & Adjust",
    heading: "Making Your Budget a Living Document",
    content: `A budget reviewed once and forgotten isn't a budget — it's a spreadsheet. The habit that makes budgeting effective is the regular check-in: comparing what you planned against what actually happened.

Monthly reviews work well for most people. Look at each category, note where you went over or under, and ask why. Over time, your targets will get more accurate and your spending more intentional.

Life changes, and your budget should too. A new job, a move, a relationship change — any of these warrant a budget reset. The goal isn't a perfect budget; it's a budget that reflects your life right now.`,
  },
]

export function ContentPane({
  canvasOpen,
  onToggleCanvas,
  mapOpen,
  onToggleMap,
}: ContentPaneProps) {
  const [activeLesson, setActiveLesson] = useState(0)
  const lesson = LESSONS[activeLesson]

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

            {/* Current lesson name + dots */}
            <div className="flex shrink-0 items-center gap-2 rounded-full border border-border px-3 py-1">
              <span className="font-medium text-foreground">
                Lesson {activeLesson + 1}: {lesson.title}
              </span>

              {/* Lesson dots */}
              <div className="flex items-center gap-1">
                {LESSONS.map((l, i) => (
                  <div key={i} className="flex items-center gap-1">
                    {i > 0 && (
                      <div
                        className={cn(
                          "h-px w-3 transition-colors",
                          i <= activeLesson ? "bg-primary" : "bg-border",
                        )}
                      />
                    )}
                    <button
                      onClick={() => setActiveLesson(i)}
                      title={`Lesson ${i + 1}: ${l.title}`}
                      className={cn(
                        "relative flex items-center justify-center rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        i === activeLesson
                          ? "h-3.5 w-3.5 border-2 border-foreground bg-background"
                          : i < activeLesson
                            ? "h-2.5 w-2.5 border-2 border-primary bg-primary"
                            : "h-2.5 w-2.5 border-2 border-border bg-background",
                      )}
                    >
                      {i < activeLesson && (
                        <Check className="size-1.5 text-primary-foreground" strokeWidth={3} />
                      )}
                    </button>
                  </div>
                ))}
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
            {lesson.heading}
          </h2>
          <Separator className="mb-5" />
          <div className="space-y-4">
            {lesson.content.split("\n\n").map((para, i) => (
              <p key={i} className="text-sm leading-relaxed text-muted-foreground">
                {para}
              </p>
            ))}
          </div>
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
