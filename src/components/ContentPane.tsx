import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { CourseNavigator } from "@/components/CourseNavigator"

interface ContentPaneProps {
  mapOpen: boolean
  onToggleMap: () => void
}

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
            content:
              "Saving is the foundation of financial resilience. In this lesson we explore the psychological and practical reasons for building a savings habit, from handling unexpected expenses to working towards long-term goals. Understanding your 'why' is the first step to making saving stick.",
          },
          {
            id: 2,
            title: "Emergency Funds",
            heading: "Your Financial Safety Net",
            content:
              "An emergency fund is a dedicated pool of money set aside for unexpected events — job loss, medical bills, urgent repairs. We cover how much to save, where to keep it, and the step-by-step process of building one even on a tight budget.",
          },
          {
            id: 3,
            title: "Savings Accounts",
            heading: "Making Your Money Work",
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
            content:
              "Investing means putting your money to work with the expectation of a future return. This lesson introduces the core idea of growing wealth over time, contrasting investing with saving, and explaining why starting early — even with small amounts — can have an outsized impact thanks to compounding.",
          },
          {
            id: 2,
            title: "Risk & Return",
            heading: "Understanding Risk",
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
            content:
              "A stock represents a small ownership stake in a company. This lesson explains how stocks are issued, how stock markets work, and what it means to be a shareholder — including rights to dividends and voting. We cover the difference between common and preferred shares.",
          },
          {
            id: 2,
            title: "Buying & Selling",
            heading: "How to Trade",
            content:
              "From choosing a broker to placing your first order, this lesson walks through the mechanics of buying and selling shares. We explain market orders versus limit orders, bid-ask spreads, and the costs involved — so you can trade confidently and avoid common beginner mistakes.",
          },
          {
            id: 3,
            title: "Dividends",
            heading: "Earning from Stocks",
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
            content:
              "Diversification spreads your investments across different assets, sectors, and geographies to reduce the impact of any single loss. This lesson explains why diversification works, how to assess your current concentration risk, and practical ways to diversify without over-complicating your portfolio.",
          },
          {
            id: 2,
            title: "Asset Allocation",
            heading: "Balancing Your Investments",
            content:
              "Asset allocation is the process of deciding how to split your portfolio between asset classes — stocks, bonds, property, and cash. We explore how your time horizon, income needs, and risk appetite should drive your allocation, and introduce classic frameworks like the age-based rule of thumb.",
          },
          {
            id: 3,
            title: "Long-term Planning",
            heading: "Investing for the Future",
            content:
              "Long-term investing requires patience, discipline, and a plan. This lesson covers how to set investment goals, the importance of staying invested through market downturns, dollar-cost averaging, and how to review your portfolio periodically without reacting to short-term noise.",
          },
          {
            id: 4,
            title: "Portfolio Review",
            heading: "Staying on Track",
            content:
              "Regular portfolio reviews keep your investments aligned with your goals. We cover how often to review, what to look for (drift from target allocation, underperforming holdings, changing life circumstances), and when it makes sense to rebalance versus hold steady.",
          },
        ],
      },
    ],
  },
]

type DropdownId = "unit" | "topic" | "lesson"

export function ContentPane({ mapOpen, onToggleMap }: ContentPaneProps) {
  const [unitId, setUnitId] = useState(1)
  const [topicId, setTopicId] = useState(1)
  const [lessonId, setLessonId] = useState(1)
  const [openDropdown, setOpenDropdown] = useState<DropdownId | null>(null)
  const breadcrumbRef = useRef<HTMLDivElement>(null)

  const unit = CURRICULUM.find((u) => u.id === unitId)!
  const topic = unit.topics.find((t) => t.id === topicId)!
  const lesson = topic.lessons.find((l) => l.id === lessonId)!

  useEffect(() => {
    if (!openDropdown) return
    function handleClickOutside(e: MouseEvent) {
      if (breadcrumbRef.current && !breadcrumbRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [openDropdown])

  function selectUnit(id: number) {
    const newUnit = CURRICULUM.find((u) => u.id === id)!
    setUnitId(id)
    setTopicId(newUnit.topics[0].id)
    setLessonId(newUnit.topics[0].lessons[0].id)
    setOpenDropdown(null)
  }

  function selectTopic(id: number) {
    const newTopic = unit.topics.find((t) => t.id === id)!
    setTopicId(id)
    setLessonId(newTopic.lessons[0].id)
    setOpenDropdown(null)
  }

  function selectLesson(id: number) {
    setLessonId(id)
    setOpenDropdown(null)
  }

  function toggleDropdown(id: DropdownId) {
    setOpenDropdown((prev) => (prev === id ? null : id))
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-muted/50">
      {/* Breadcrumb bar — always visible at top */}
      <div
        ref={breadcrumbRef}
        className={cn("relative z-10 bg-muted/40 backdrop-blur-sm px-4 sm:px-8 py-3 rounded-b-xl", mapOpen && "hidden")}
      >
        <div className="flex flex-wrap items-center gap-x-1 gap-y-1.5 text-sm text-muted-foreground">

          {/* Unit */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("unit")}
              className="group/crumb flex shrink-0 cursor-pointer items-center gap-1 rounded-md px-2 py-1 font-semibold text-foreground transition-colors hover:bg-black/10"
            >
              {unit.title}
              <ChevronDown
                className={cn(
                  "size-3 transition-all",
                  openDropdown === "unit"
                    ? "opacity-100 rotate-180"
                    : "opacity-0 group-hover/crumb:opacity-100",
                )}
              />
            </button>
            {openDropdown === "unit" && (
              <div className="absolute left-0 top-full z-[9999] mt-1 min-w-[200px] overflow-hidden rounded-md border border-border bg-white py-1 shadow-md">
                {CURRICULUM.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => selectUnit(u.id)}
                    className={cn(
                      "flex w-full items-baseline gap-2 px-3 py-1.5 text-left text-sm transition-colors hover:bg-black/10",
                      u.id === unitId ? "font-semibold text-foreground" : "text-muted-foreground",
                    )}
                  >
                    <span className="shrink-0 text-xs text-muted-foreground">{u.code}</span>
                    {u.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="shrink-0 select-none text-muted-foreground/60">/</span>

          {/* Topic */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("topic")}
              className="group/crumb flex shrink-0 cursor-pointer items-center gap-1 rounded-md px-2 py-1 font-semibold text-foreground transition-colors hover:bg-black/10"
            >
              {topic.title}
              <ChevronDown
                className={cn(
                  "size-3 transition-all",
                  openDropdown === "topic"
                    ? "opacity-100 rotate-180"
                    : "opacity-0 group-hover/crumb:opacity-100",
                )}
              />
            </button>
            {openDropdown === "topic" && (
              <div className="absolute left-0 top-full z-[9999] mt-1 min-w-[220px] overflow-hidden rounded-md border border-border bg-white py-1 shadow-md">
                {unit.topics.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => selectTopic(t.id)}
                    className={cn(
                      "flex w-full items-baseline gap-2 px-3 py-1.5 text-left text-sm transition-colors hover:bg-black/10",
                      t.id === topicId ? "font-semibold text-foreground" : "text-muted-foreground",
                    )}
                  >
                    <span className="shrink-0 text-xs text-muted-foreground">Topic {t.id}:</span>
                    {t.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="shrink-0 select-none text-muted-foreground/60">/</span>

          {/* Lesson */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("lesson")}
              className="group/crumb flex shrink-0 cursor-pointer items-center gap-1 rounded-md px-2 py-1 font-semibold text-foreground transition-colors hover:bg-black/10"
            >
              {lesson.title}
              <ChevronDown
                className={cn(
                  "size-3 transition-all",
                  openDropdown === "lesson"
                    ? "opacity-100 rotate-180"
                    : "opacity-0 group-hover/crumb:opacity-100",
                )}
              />
            </button>
            {openDropdown === "lesson" && (
              <div className="absolute left-0 top-full z-[9999] mt-1 min-w-[220px] overflow-hidden rounded-md border border-border bg-white py-1 shadow-md">
                {topic.lessons.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => selectLesson(l.id)}
                    className={cn(
                      "flex w-full items-baseline gap-2 px-3 py-1.5 text-left text-sm transition-colors hover:bg-black/10",
                      l.id === lessonId ? "font-semibold text-foreground" : "text-muted-foreground",
                    )}
                  >
                    <span className="shrink-0 text-xs text-muted-foreground">Lesson {l.id}:</span>
                    {l.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="shrink-0 select-none text-muted-foreground/60">/</span>

          {/* Learning Objective — hover effect only, no chevron, no dropdown */}
          <div className="group/objective relative flex shrink-0 items-center">
            <div className="flex cursor-default items-center gap-1 rounded-md px-2 py-1 transition-colors hover:bg-black/10">
              <span className="text-xs text-muted-foreground">LO:</span>
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
