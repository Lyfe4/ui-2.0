import { useCallback, useEffect, useRef, useState } from "react"
import {
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Send,
  Sparkles,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const messages = [
  {
    id: 1,
    role: "assistant" as const,
    name: "Madgwick",
    content:
      "Welcome to Introduction for B123. When you're ready, start a new conversation by asking a question or describing what you'd like to work on.",
  },
]

const navItems = [
  { id: "learn", label: "Learn", icon: Sparkles },
  { id: "social", label: "Social", icon: Users },
  { id: "support", label: "Support", icon: HelpCircle },
]

const MIN_WIDTH = 260
const MAX_WIDTH = 560
const DEFAULT_WIDTH = 384

interface ChatPaneProps {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
  mapOpen: boolean
  onToggleMap: () => void
}

export function ChatPane({ collapsed, onCollapsedChange, mapOpen, onToggleMap }: ChatPaneProps) {
  const [input, setInput] = useState("")
  const [activeNav, setActiveNav] = useState("learn")
  const [width, setWidth] = useState(DEFAULT_WIDTH)
  const [isResizing, setIsResizing] = useState(false)
  const startX = useRef(0)
  const startWidth = useRef(0)

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    startX.current = e.clientX
    startWidth.current = width
    setIsResizing(true)
  }, [width])

  useEffect(() => {
    if (!isResizing) return

    const prevCursor = document.body.style.cursor
    const prevSelect = document.body.style.userSelect
    document.body.style.cursor = "ew-resize"
    document.body.style.userSelect = "none"

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - startX.current
      setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth.current + delta)))
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.body.style.cursor = prevCursor
      document.body.style.userSelect = prevSelect
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = prevCursor
      document.body.style.userSelect = prevSelect
    }
  }, [isResizing])

  if (collapsed) {
    return (
      <div className="flex w-12 flex-shrink-0 flex-col items-center gap-1 rounded-r-2xl bg-background border border-black/[0.07] shadow-[2px_0_12px_-2px_rgba(0,0,0,0.08)] my-2 px-1 pt-4 pb-3">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Expand chat"
          title="Expand chat"
          onClick={() => onCollapsedChange(false)}
        >
          <PanelLeftOpen />
        </Button>

        <div className="mt-1 flex flex-col gap-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant="ghost"
              size="icon-sm"
              aria-label={label}
              title={label}
              aria-pressed={activeNav === id}
              onClick={() => setActiveNav(id)}
              className={cn(
                activeNav === id &&
                  "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
              )}
            >
              <Icon />
            </Button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative flex flex-shrink-0 flex-col rounded-r-2xl bg-background border border-black/[0.07] shadow-[2px_0_12px_-2px_rgba(0,0,0,0.08)] my-2"
      style={{ width }}
    >
      <div className="flex items-center gap-2 px-3 pb-2 pt-4">
        <div className="flex flex-1 items-center gap-1 rounded-xl bg-muted p-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              aria-pressed={activeNav === id}
              onClick={() => setActiveNav(id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all",
                activeNav === id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Collapse chat"
          title="Collapse chat"
          onClick={() => onCollapsedChange(true)}
        >
          <PanelLeftClose />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-4 py-4">
        <div className="space-y-5">
          {messages.map((msg) => (
            <div key={msg.id} className="flex gap-3">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-border text-xs font-semibold text-foreground">
                {msg.name[0]}
              </div>
              <div className="min-w-0">
                <p className="mb-1 text-xs font-semibold text-foreground">
                  {msg.name}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {msg.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="px-3 pb-3">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-muted px-3 py-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="min-w-0 flex-1 bg-transparent px-1 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <Button variant="ghost" size="icon-xs" aria-label="Send" className="shrink-0 text-muted-foreground hover:text-foreground">
            <Send />
          </Button>
        </div>
      </div>

      {/* Resize handle */}
      <div
        onMouseDown={handleResizeStart}
        aria-hidden
        className={cn(
          "group absolute right-0 top-0 h-full w-3 cursor-ew-resize rounded-r-2xl",
          "flex items-center justify-end pr-px",
        )}
      >
        <div
          className={cn(
            "h-10 w-[3px] rounded-full transition-all duration-150",
            isResizing
              ? "bg-primary/50 opacity-100"
              : "bg-foreground/15 opacity-0 group-hover:opacity-100",
          )}
        />
      </div>
    </div>
  )
}
