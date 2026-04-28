import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

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
    isInProgress: true,
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

const RADIUS = 13
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function ProgressCircle({ percent }: { percent: number }) {
  const offset = CIRCUMFERENCE * (1 - percent / 100)
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      className="-rotate-90 shrink-0"
    >
      <circle
        cx="16"
        cy="16"
        r={RADIUS}
        fill="none"
        strokeWidth="3"
        stroke="currentColor"
        className="text-stone-200"
      />
      {percent > 0 && (
        <circle
          cx="16"
          cy="16"
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
    <div className="flex flex-1 flex-col items-center rounded-lg bg-white px-2 py-2">
      <span className="text-sm font-bold text-stone-700">{value}</span>
      <span className="text-[9px] font-semibold uppercase tracking-wider text-stone-400">
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
    <button
      onClick={onTopicSelect}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-primary/10",
        topic.isActive && "bg-primary/10",
      )}
    >
      <div
        className={cn(
          "h-1.5 w-1.5 shrink-0 rounded-full",
          topic.isActive ? "bg-primary" : "bg-stone-300",
        )}
      />
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-xs font-medium",
            topic.isActive ? "text-primary" : "text-stone-600",
          )}
        >
          {topic.title}
        </p>
        <p className="text-[10px] text-stone-400">{topic.lessonCount} lessons</p>
      </div>
    </button>
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
  return (
    <div className="rounded-lg border border-stone-200 bg-white overflow-hidden">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-stone-50"
      >
        <ProgressCircle percent={unit.progressPercent} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-stone-700 leading-tight">
            {unit.title}
          </p>
          <p className="text-[10px] text-stone-400 mt-0.5">
            {unit.topics.length} {unit.topics.length === 1 ? "Topic" : "Topics"} · 0/
            {unit.topics.length}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {unit.isInProgress && (
            <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-primary">
              In Progress
            </span>
          )}
          {isExpanded ? (
            <ChevronDown className="h-3.5 w-3.5 text-stone-400" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-stone-400" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-stone-100 px-2 py-1.5 space-y-0.5">
          {unit.topics.map((topic) => (
            <TopicRow
              key={topic.id}
              topic={topic}
              onTopicSelect={onTopicSelect}
            />
          ))}
        </div>
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
      <div className="flex gap-1.5 px-3 pb-3">
        <StatCard label="Units" value={UNITS.length} />
        <StatCard label="Topics" value={totalTopics} />
        <StatCard label="Complete" value="0%" />
      </div>

      <div className="flex-1 space-y-1.5 overflow-y-auto px-3 pb-3">
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
    </div>
  )
}
