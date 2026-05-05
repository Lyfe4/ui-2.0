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
      <div className="flex w-12 flex-shrink-0 flex-col items-center rounded-r-2xl bg-background border border-black/[0.07] shadow-[2px_0_12px_-2px_rgba(0,0,0,0.08)] my-2 px-1 pb-3">
        <div className="flex h-14 items-center justify-center">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Expand chat"
            title="Expand chat"
            onClick={() => onCollapsedChange(false)}
            className="hover:bg-black/10"
          >
            <PanelLeftOpen />
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
      <div className="flex h-14 items-center gap-2 px-3">
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
                  : "text-muted-foreground hover:bg-black/10 hover:text-foreground",
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
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
          className="hover:bg-black/10"
        >
          <PanelLeftClose />
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
    </div>
  )
}
