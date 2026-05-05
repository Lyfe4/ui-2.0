import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface Topic {
  id: string
  title: string
  lessonCount: number
  isActive: boolean
}

interface Unit {
  id: string
  title: string
  progressPercent: number
  isInProgress: boolean
  topics: Topic[]
}

interface CourseNavigatorProps {
  onTopicSelect: () => void
}

const UNITS: Unit[] = [
  {
    id: "u1",
    title: "Budgeting",
    progressPercent: 0,
    isInProgress: false,
    topics: [
      { id: "t1", title: "Tracking Expenses", lessonCount: 2, isActive: true },
    ],
  },
  {
    id: "u2",
    title: "Introduction to Programming and the Web",
    progressPercent: 43,
    isInProgress: false,
    topics: [
      { id: "t2", title: "Web Fundamentals", lessonCount: 2, isActive: false },
      { id: "t3", title: "HTML & CSS Basics", lessonCount: 3, isActive: false },
      { id: "t4", title: "JavaScript Intro", lessonCount: 4, isActive: false },
    ],
  },
  {
    id: "u3",
    title: "Programming Paradigms",
    progressPercent: 0,
    isInProgress: false,
    topics: [
      { id: "t5", title: "OOP vs Functional", lessonCount: 3, isActive: false },
    ],
  },
  {
    id: "u4",
    title: "Digital Futures: AI, Emergent Technology and Crime",
    progressPercent: 0,
    isInProgress: false,
    topics: [
      { id: "t6", title: "AI in Society", lessonCount: 2, isActive: false },
    ],
  },
  {
    id: "u5",
    title: "Risk, Compliance and WHS",
    progressPercent: 17,
    isInProgress: false,
    topics: [
      { id: "t7", title: "Workplace Safety", lessonCount: 4, isActive: false },
    ],
  },
]

const RADIUS = 18
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function ProgressCircle({ percent }: { percent: number }) {
  const offset = CIRCUMFERENCE * (1 - percent / 100)
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      className="-rotate-90 shrink-0"
      aria-hidden
    >
      <circle
        cx="22"
        cy="22"
        r={RADIUS}
        fill="none"
        strokeWidth="3"
        stroke="currentColor"
        className="text-border"
      />
      {percent > 0 && (
        <circle
          cx="22"
          cy="22"
          r={RADIUS}
          fill="none"
          strokeWidth="3"
          stroke="currentColor"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          className="text-primary"
        />
      )}
    </svg>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-1 flex-col items-center rounded-lg border border-border bg-card px-3 py-3 shadow-xs">
      <span className="text-base font-bold text-card-foreground">{value}</span>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

function TopicRow({
  topic,
  onTopicSelect,
}: {
  topic: Topic
  onTopicSelect: () => void
}) {
  return (
    <Button
      variant="ghost"
      onClick={onTopicSelect}
      className={cn(
        "h-auto w-full justify-start gap-3 px-4 py-3 font-normal",
        topic.isActive && "bg-primary/10 text-primary hover:bg-primary/15",
      )}
    >
      <div
        className={cn(
          "h-2 w-2 shrink-0 rounded-full",
          topic.isActive ? "bg-primary" : "bg-border",
        )}
      />
      <div className="min-w-0 flex-1 text-left">
        <p className="truncate text-sm font-medium">{topic.title}</p>
        <p className="text-xs text-muted-foreground">
          {topic.lessonCount} lessons
        </p>
      </div>
    </Button>
  )
}

function UnitRow({
  unit,
  isExpanded,
  onToggle,
  onTopicSelect,
}: {
  unit: Unit
  isExpanded: boolean
  onToggle: () => void
  onTopicSelect: () => void
}) {
  const isActive = unit.topics.some((t) => t.isActive)

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-card",
        isActive ? "border-primary/50 ring-1 ring-primary/20" : "border-border",
      )}
    >
      <Button
        variant="ghost"
        onClick={onToggle}
        className="h-auto w-full justify-start gap-2 sm:gap-4 rounded-none px-4 py-4 hover:bg-surface-hover"
      >
        <ProgressCircle percent={unit.progressPercent} />
        <div className="min-w-0 flex-1 text-left">
          <p className="truncate text-sm font-semibold text-card-foreground leading-snug">
            {unit.title}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {unit.topics.length}{" "}
            {unit.topics.length === 1 ? "Topic" : "Topics"} · 0/
            {unit.topics.length} complete
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {unit.isInProgress && (
            <Badge variant="accent">In Progress</Badge>
          )}
          {isExpanded ? (
            <ChevronDown className="size-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="size-4 text-muted-foreground" />
          )}
        </div>
      </Button>

      {isExpanded && (
        <>
          <Separator />
          <div className="space-y-0.5 px-2 py-2">
            {unit.topics.map((topic) => (
              <TopicRow
                key={topic.id}
                topic={topic}
                onTopicSelect={onTopicSelect}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function CourseNavigator({ onTopicSelect }: CourseNavigatorProps) {
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(
    new Set(["u1"]),
  )

  const totalTopics = UNITS.reduce((sum, u) => sum + u.topics.length, 0)

  function toggleUnit(id: string) {
    setExpandedUnits((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex gap-3 px-4 sm:px-8 pb-5">
        <StatCard label="Units" value={UNITS.length} />
        <StatCard label="Topics" value={totalTopics} />
        <StatCard label="Complete" value="0%" />
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2 px-4 sm:px-8 pb-6">
          {UNITS.map((unit) => (
            <UnitRow
              key={unit.id}
              unit={unit}
              isExpanded={expandedUnits.has(unit.id)}
              onToggle={() => toggleUnit(unit.id)}
              onTopicSelect={onTopicSelect}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
