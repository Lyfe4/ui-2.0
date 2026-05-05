import { useState } from "react"
import { Folder, ChevronDown, CheckCircle2, CircleDot } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CourseNavigator } from "@/components/CourseNavigator"

interface ContentPaneProps {
  mapOpen: boolean
  onToggleMap: () => void
}

type Status = "complete" | "in-progress" | "not-started"

const CURRICULUM = [
  {
    id: 1,
    code: "PF1",
    title: "Personal Finance",
    topics: [
      {
        id: 1,
        title: "Tracking Expenses",
        lessons: [
          {
            id: 1,
            title: "Introduction",
            heading: "Welcome",
            status: "complete" as Status,
            content:
              "Welcome to the first lesson on tracking expenses. Here we introduce the fundamental concepts of budgeting and why monitoring your spending is crucial for financial health. By the end of this lesson you'll understand why even small daily purchases matter in the bigger picture of your financial wellbeing.",
          },
          {
            id: 2,
            title: "Income & Fixed Costs",
            heading: "Understanding Your Income",
            status: "complete" as Status,
            content:
              "In this lesson we explore how to categorise your income sources and identify fixed costs — the recurring expenses that stay the same each month. Fixed costs such as rent, loan repayments, and subscriptions form the foundation of any solid budget because they are predictable and non-negotiable.",
          },
          {
            id: 3,
            title: "Variable Expenses",
            heading: "Managing Variable Spending",
            status: "complete" as Status,
            content:
              "Variable expenses fluctuate month to month. This lesson covers strategies to track and manage spending on groceries, entertainment, dining out, and other discretionary categories. You'll learn how to spot patterns in your variable spending and where small adjustments can make a big difference.",
          },
          {
            id: 4,
            title: "Building a Budget",
            heading: "Creating Your First Budget",
            status: "complete" as Status,
            content:
              "Put your knowledge into practice. We walk through building a simple monthly budget template, setting realistic spending targets for each category, and balancing your income against your outgoings. A well-constructed budget is a living document — we'll show you how to keep it up to date.",
          },
        ],
      },
      {
        id: 2,
        title: "Saving Strategies",
        lessons: [
          {
            id: 1,
            title: "Why Save?",
            heading: "The Case for Saving",
            status: "complete" as Status,
            content:
              "Saving is the foundation of financial resilience. In this lesson we explore the psychological and practical reasons for building a savings habit, from handling unexpected expenses to working towards long-term goals. Understanding your 'why' is the first step to making saving stick.",
          },
          {
            id: 2,
            title: "Emergency Funds",
            heading: "Your Financial Safety Net",
            status: "complete" as Status,
            content:
              "An emergency fund is a dedicated pool of money set aside for unexpected events — job loss, medical bills, urgent repairs. We cover how much to save, where to keep it, and the step-by-step process of building one even on a tight budget.",
          },
          {
            id: 3,
            title: "Savings Accounts",
            heading: "Making Your Money Work",
            status: "complete" as Status,
            content:
              "Not all savings accounts are equal. This lesson compares account types — instant-access, notice accounts, and cash ISAs — and explains how interest rates, tax wrappers, and access restrictions affect your returns. We'll help you choose the right account for each savings goal.",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    code: "IF2",
    title: "Investing Fundamentals",
    topics: [
      {
        id: 1,
        title: "Introduction to Investing",
        lessons: [
          {
            id: 1,
            title: "What is Investing?",
            heading: "Investing Basics",
            status: "complete" as Status,
            content:
              "Investing means putting your money to work with the expectation of a future return. This lesson introduces the core idea of growing wealth over time, contrasting investing with saving, and explaining why starting early — even with small amounts — can have an outsized impact thanks to compounding.",
          },
          {
            id: 2,
            title: "Risk & Return",
            heading: "Understanding Risk",
            status: "in-progress" as Status,
            content:
              "Every investment carries some level of risk. Here we unpack the relationship between risk and potential return, introduce common risk categories (market risk, liquidity risk, inflation risk), and discuss how your personal risk tolerance should shape your investment choices.",
          },
        ],
      },
      {
        id: 2,
        title: "Stocks & Shares",
        lessons: [
          {
            id: 1,
            title: "Understanding Stocks",
            heading: "What Are Stocks?",
            status: "not-started" as Status,
            content:
              "A stock represents a small ownership stake in a company. This lesson explains how stocks are issued, how stock markets work, and what it means to be a shareholder — including rights to dividends and voting. We cover the difference between common and preferred shares.",
          },
          {
            id: 2,
            title: "Buying & Selling",
            heading: "How to Trade",
            status: "not-started" as Status,
            content:
              "From choosing a broker to placing your first order, this lesson walks through the mechanics of buying and selling shares. We explain market orders versus limit orders, bid-ask spreads, and the costs involved — so you can trade confidently and avoid common beginner mistakes.",
          },
          {
            id: 3,
            title: "Dividends",
            heading: "Earning from Stocks",
            status: "not-started" as Status,
            content:
              "Dividends are a share of a company's profits paid out to shareholders. This lesson covers how dividend income works, the difference between income and growth stocks, dividend reinvestment strategies, and how to evaluate a company's dividend history when making investment decisions.",
          },
        ],
      },
      {
        id: 3,
        title: "Building a Portfolio",
        lessons: [
          {
            id: 1,
            title: "Diversification",
            heading: "Don't Put All Your Eggs in One Basket",
            status: "not-started" as Status,
            content:
              "Diversification spreads your investments across different assets, sectors, and geographies to reduce the impact of any single loss. This lesson explains why diversification works, how to assess your current concentration risk, and practical ways to diversify without over-complicating your portfolio.",
          },
          {
            id: 2,
            title: "Asset Allocation",
            heading: "Balancing Your Investments",
            status: "not-started" as Status,
            content:
              "Asset allocation is the process of deciding how to split your portfolio between asset classes — stocks, bonds, property, and cash. We explore how your time horizon, income needs, and risk appetite should drive your allocation, and introduce classic frameworks like the age-based rule of thumb.",
          },
          {
            id: 3,
            title: "Long-term Planning",
            heading: "Investing for the Future",
            status: "not-started" as Status,
            content:
              "Long-term investing requires patience, discipline, and a plan. This lesson covers how to set investment goals, the importance of staying invested through market downturns, dollar-cost averaging, and how to review your portfolio periodically without reacting to short-term noise.",
          },
          {
            id: 4,
            title: "Portfolio Review",
            heading: "Staying on Track",
            status: "not-started" as Status,
            content:
              "Regular portfolio reviews keep your investments aligned with your goals. We cover how often to review, what to look for (drift from target allocation, underperforming holdings, changing life circumstances), and when it makes sense to rebalance versus hold steady.",
          },
        ],
      },
    ],
  },
]

function topicStatus(topic: (typeof CURRICULUM)[number]["topics"][number]): Status {
  const statuses = topic.lessons.map((l) => l.status)
  if (statuses.every((s) => s === "complete")) return "complete"
  if (statuses.some((s) => s === "complete" || s === "in-progress")) return "in-progress"
  return "not-started"
}

function unitStatus(unit: (typeof CURRICULUM)[number]): Status {
  const statuses = unit.topics.map(topicStatus)
  if (statuses.every((s) => s === "complete")) return "complete"
  if (statuses.some((s) => s === "complete" || s === "in-progress")) return "in-progress"
  return "not-started"
}

function StatusIcon({ status }: { status: Status }) {
  if (status === "complete")
    return (
      <span title="Complete" className="flex shrink-0">
        <CheckCircle2 className="size-3.5 text-primary" />
      </span>
    )
  if (status === "in-progress")
    return (
      <span title="In Progress" className="flex shrink-0">
        <CircleDot className="size-3.5 text-warning" />
      </span>
    )
  return <span className="size-3.5 shrink-0" />
}

export function ContentPane({ mapOpen, onToggleMap }: ContentPaneProps) {
  const [unitId, setUnitId] = useState(1)
  const [topicId, setTopicId] = useState(1)
  const [lessonId, setLessonId] = useState(1)

  const unit = CURRICULUM.find((u) => u.id === unitId)!
  const topic = unit.topics.find((t) => t.id === topicId)!
  const lesson = topic.lessons.find((l) => l.id === lessonId)!

  function selectUnit(id: number) {
    const newUnit = CURRICULUM.find((u) => u.id === id)!
    setUnitId(id)
    setTopicId(newUnit.topics[0].id)
    setLessonId(newUnit.topics[0].lessons[0].id)
  }

  function selectTopic(id: number) {
    const newTopic = unit.topics.find((t) => t.id === id)!
    setTopicId(id)
    setLessonId(newTopic.lessons[0].id)
  }

  function selectLesson(id: number) {
    setLessonId(id)
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-muted/50">
      {/* Breadcrumb bar — always visible at top */}
      <div
        className={cn("relative z-10 flex h-14 flex-wrap items-center gap-x-0.5 gap-y-1.5 bg-muted/40 backdrop-blur-sm px-4 sm:px-8 mt-2 rounded-2xl text-sm text-muted-foreground", mapOpen && "hidden")}
      >

          {/* Unit */}
          <DropdownMenu>
            <DropdownMenuTrigger className="group/crumb flex shrink-0 cursor-pointer items-center gap-0.5 rounded-md pl-1.5 pr-0.5 py-1 text-foreground transition-colors hover:bg-accent outline-none">
              <Folder className="size-3.5 shrink-0 mr-0.5 text-muted-foreground" />
              {unit.title}
              <ChevronDown className="size-3 transition-all opacity-0 group-hover/crumb:opacity-100 group-data-[state=open]/crumb:opacity-100 group-data-[state=open]/crumb:rotate-180" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[220px]">
              {CURRICULUM.map((u) => (
                <DropdownMenuItem
                  key={u.id}
                  onClick={() => selectUnit(u.id)}
                  className={cn(u.id === unitId ? "font-semibold text-foreground" : "text-muted-foreground")}
                >
                  <StatusIcon status={unitStatus(u)} />
                  <span className="shrink-0 text-xs text-muted-foreground">{u.code}</span>
                  <span className="shrink-0 text-xs text-muted-foreground/50">—</span>
                  {u.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <span className="shrink-0 select-none text-muted-foreground/60">/</span>

          {/* Topic */}
          <DropdownMenu>
            <DropdownMenuTrigger className="group/crumb flex shrink-0 cursor-pointer items-center gap-0.5 rounded-md pl-1.5 pr-0.5 py-1 text-foreground transition-colors hover:bg-accent outline-none">
              {topic.title}
              <ChevronDown className="size-3 transition-all opacity-0 group-hover/crumb:opacity-100 group-data-[state=open]/crumb:opacity-100 group-data-[state=open]/crumb:rotate-180" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[220px]">
              {unit.topics.map((t) => (
                <DropdownMenuItem
                  key={t.id}
                  onClick={() => selectTopic(t.id)}
                  className={cn(t.id === topicId ? "font-semibold text-foreground" : "text-muted-foreground")}
                >
                  <StatusIcon status={topicStatus(t)} />
                  <span className="shrink-0 text-xs text-muted-foreground">Topic {t.id}:</span>
                  {t.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <span className="shrink-0 select-none text-muted-foreground/60">/</span>

          {/* Lesson */}
          <DropdownMenu>
            <DropdownMenuTrigger className="group/crumb flex shrink-0 cursor-pointer items-center gap-0.5 rounded-md pl-1.5 pr-0.5 py-1 text-foreground transition-colors hover:bg-accent outline-none">
              {lesson.title}
              <ChevronDown className="size-3 transition-all opacity-0 group-hover/crumb:opacity-100 group-data-[state=open]/crumb:opacity-100 group-data-[state=open]/crumb:rotate-180" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[220px]">
              {topic.lessons.map((l) => (
                <DropdownMenuItem
                  key={l.id}
                  onClick={() => selectLesson(l.id)}
                  className={cn(l.id === lessonId ? "font-semibold text-foreground" : "text-muted-foreground")}
                >
                  <StatusIcon status={l.status} />
                  <span className="shrink-0 text-xs text-muted-foreground">Lesson {l.id}:</span>
                  {l.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <span className="shrink-0 select-none text-muted-foreground/60">/</span>

          {/* Learning Objective — hover effect only, no chevron, no dropdown */}
          <div className="group/objective relative flex shrink-0 items-center">
            <div className="flex cursor-default items-center gap-1 rounded-md pl-1.5 pr-0.5 py-1 transition-colors hover:bg-accent">
              <span className="text-foreground">LO:</span>
              <div className="h-2.5 w-2.5 rounded-full border-2 border-border bg-background" />
            </div>
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
