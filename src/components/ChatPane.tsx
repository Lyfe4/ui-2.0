import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
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
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

const messages = [
  {
    id: 1,
    role: "user" as const,
    content: "can you explain how the immune system recognises pathogens?",
  },
  {
    id: 2,
    role: "assistant" as const,
    content:
      "Your immune system uses two main strategies.\n\nThe innate system is fast and non-specific — it spots molecular patterns shared across many pathogens, like bacterial cell-wall components, and mounts an immediate response.\n\nThe adaptive system is slower but precise. B and T cells carry receptors that match specific antigens. When a match is found those cells multiply and attack — and a small pool persists as memory cells, which is why you respond faster to something you've encountered before.",
  },
  {
    id: 3,
    role: "user" as const,
    content: "what happens when it makes a mistake?",
  },
  {
    id: 4,
    role: "assistant" as const,
    content:
      "Two main failure modes.\n\nAutoimmunity is when the adaptive system targets your own tissue — it mistakes self for non-self. Type 1 diabetes, lupus, and multiple sclerosis all work this way.\n\nAllergies are the innate system overreacting to harmless substances. Pollen, peanuts, dust mites — not threats, but in some people the immune system treats them like pathogens and fires off a disproportionate response.",
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
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])
  const navRef = useRef<HTMLDivElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const activeNavRef = useRef(activeNav)
  activeNavRef.current = activeNav
  // Lags behind `collapsed` on close so expanded content clips during animation;
  // updates immediately on open so content is revealed as width grows.
  const [visuallyCollapsed, setVisuallyCollapsed] = useState(collapsed)
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current)
    if (collapsed) {
      collapseTimerRef.current = setTimeout(() => setVisuallyCollapsed(true), 270)
    } else {
      setVisuallyCollapsed(false)
    }
    return () => {
      if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current)
    }
  }, [collapsed])

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

  const measureIndicator = useCallback(() => {
    const activeIndex = navItems.findIndex(item => item.id === activeNavRef.current)
    const btn = buttonRefs.current[activeIndex]
    if (btn) {
      setIndicatorStyle({ left: btn.offsetLeft, width: btn.offsetWidth })
    }
  }, [])

  // Immediate remeasure when active tab or view changes
  useLayoutEffect(() => {
    measureIndicator()
  }, [activeNav, visuallyCollapsed, measureIndicator])

  // Continuous remeasure while the container animates (covers expand/collapse + manual resize)
  useEffect(() => {
    if (visuallyCollapsed || !navRef.current) return
    const observer = new ResizeObserver(measureIndicator)
    observer.observe(navRef.current)
    return () => observer.disconnect()
  }, [visuallyCollapsed, measureIndicator])

  return (
    <div
      className={cn(
        "relative flex flex-shrink-0 flex-col rounded-r-2xl bg-background border border-border shadow-panel-outset my-2 overflow-hidden",
        !isResizing && "transition-[width] duration-300 ease-in-out",
      )}
      style={{ width: collapsed ? 48 : width }}
    >
      {visuallyCollapsed ? (
        <div className="flex w-12 flex-col items-center px-1 pb-3">
          <div className="flex h-14 items-center justify-center">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Expand chat"
              title="Expand chat"
              onClick={() => onCollapsedChange(false)}
            >
              <PanelLeftOpen className="size-3.5" />
            </Button>
          </div>

          <div className="flex flex-col gap-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant="ghost"
                size="icon-sm"
                aria-label={label}
                title={label}
                onClick={() => {
                  setActiveNav(id)
                  onCollapsedChange(false)
                }}
              >
                <Icon />
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="flex h-14 items-center gap-2 px-2.5">
            <div ref={navRef} className="relative flex flex-1 items-center gap-1 rounded-xl bg-muted p-1">
              <div
                className="absolute rounded-lg bg-background shadow-sm transition-all duration-200 ease-in-out"
                style={{ left: indicatorStyle.left, width: indicatorStyle.width, top: 4, bottom: 4 }}
              />
              {navItems.map(({ id, label, icon: Icon }, index) => (
                <button
                  key={id}
                  ref={el => { buttonRefs.current[index] = el }}
                  aria-pressed={activeNav === id}
                  onClick={() => setActiveNav(id)}
                  className={cn(
                    "relative flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors duration-150",
                    activeNav === id
                      ? "text-foreground"
                      : "text-muted-foreground hover:bg-surface-hover hover:text-foreground",
                  )}
                >
                  <Icon className="h-3 w-3 shrink-0" />
                  {width >= 300 && <span>{label}</span>}
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
              <PanelLeftClose className="size-3.5" />
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-6 px-4 py-5">
              {messages.map((msg) =>
                msg.role === "user" ? (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-[82%] rounded-2xl bg-muted px-3.5 py-2.5 text-sm leading-relaxed text-foreground">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div key={msg.id} className="flex flex-col gap-3 text-sm leading-relaxed text-foreground">
                    {msg.content.split("\n\n").map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                )
              )}
            </div>
          </ScrollArea>

          <div className="px-3 pb-3">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-muted px-3 py-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="min-w-0 flex-1 border-0 bg-transparent px-1 py-0 h-auto shadow-none focus-visible:ring-0"
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
        </>
      )}
    </div>
  )
}
