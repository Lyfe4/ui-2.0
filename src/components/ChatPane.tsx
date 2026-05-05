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

const messagesByNav: Record<string, { id: number; role: "user" | "assistant" | "peer"; name?: string; content: string }[]> = {
  learn: [
    {
      id: 1,
      role: "user",
      content: "can you explain how the immune system recognises pathogens?",
    },
    {
      id: 2,
      role: "assistant",
      content:
        "Your immune system uses two main strategies.\n\nThe innate system is fast and non-specific — it spots molecular patterns shared across many pathogens, like bacterial cell-wall components, and mounts an immediate response.\n\nThe adaptive system is slower but precise. B and T cells carry receptors that match specific antigens. When a match is found those cells multiply and attack — and a small pool persists as memory cells, which is why you respond faster to something you've encountered before.",
    },
    {
      id: 3,
      role: "user",
      content: "what happens when it makes a mistake?",
    },
    {
      id: 4,
      role: "assistant",
      content:
        "Two main failure modes.\n\nAutoimmunity is when the adaptive system targets your own tissue — it mistakes self for non-self. Type 1 diabetes, lupus, and multiple sclerosis all work this way.\n\nAllergies are the innate system overreacting to harmless substances. Pollen, peanuts, dust mites — not threats, but in some people the immune system treats them like pathogens and fires off a disproportionate response.",
    },
    {
      id: 5,
      role: "user",
      content: "how does vaccination fit into all this?",
    },
    {
      id: 6,
      role: "assistant",
      content:
        "Vaccines exploit the adaptive system's memory.\n\nThey introduce an antigen — or instructions to make one — without a live infection. Your body mounts a response, generates memory B and T cells, and then clears it. If you encounter the real pathogen later, those memory cells let you respond fast enough to stop an illness from taking hold.\n\nDifferent vaccine types get the antigen in differently: live-attenuated vaccines use a weakened pathogen, subunit vaccines use just a protein fragment, and mRNA vaccines (like the COVID-19 ones) give your cells temporary instructions to produce the antigen themselves.",
    },
    {
      id: 7,
      role: "user",
      content: "why do some vaccines need boosters but others don't?",
    },
    {
      id: 8,
      role: "assistant",
      content:
        "It comes down to how long the memory response lasts, and how fast the pathogen mutates.\n\nSome vaccines — like the MMR for measles — produce a strong, durable immune memory that lasts decades, often a lifetime. Others, like flu shots, need annual updates because the influenza virus mutates so rapidly that last year's memory cells no longer recognise this year's strains.\n\nBoosters can also be needed when the initial response fades faster than expected — antibody levels drop over time, and a booster restimulates the memory cells to top them back up.",
    },
    {
      id: 9,
      role: "user",
      content: "that makes sense. what's herd immunity then?",
    },
    {
      id: 10,
      role: "assistant",
      content:
        "Herd immunity is when enough people in a population are immune that transmission chains break on their own — the pathogen can't find enough susceptible hosts to keep spreading.\n\nThe threshold varies by how contagious the disease is. Measles is extremely transmissible, so you need roughly 95% immunity to stop outbreaks. Polio needs around 80–85%.\n\nIt matters because not everyone can be vaccinated — newborns, people with certain immune conditions, or those undergoing chemotherapy rely on the people around them being immune to stay protected.",
    },
  ],
  social: [
    {
      id: 1,
      role: "peer",
      name: "Maya",
      content: "has anyone started on the cell signalling unit yet? i'm completely lost on receptor kinases",
    },
    {
      id: 2,
      role: "peer",
      name: "Jordan",
      content: "yeah i did it last week — the Khan Academy video on RTKs is actually really good, way clearer than the textbook",
    },
    {
      id: 3,
      role: "user",
      content: "thanks, i'll check it out. are we doing a study group before the midterm?",
    },
    {
      id: 4,
      role: "peer",
      name: "Maya",
      content: "yes! thursday 6pm in the library. i'll send the invite — we're planning to go through the practice exam together",
    },
    {
      id: 5,
      role: "peer",
      name: "Jordan",
      content: "i'll bring the flashcard deck i made, it covers everything from week 1–5",
    },
  ],
  support: [
    {
      id: 1,
      role: "user",
      content: "hi, i submitted my assignment two days ago but it still shows as 'pending review' — is that normal?",
    },
    {
      id: 2,
      role: "assistant",
      content:
        "Hi! Yes, that's completely normal — our tutors typically review submissions within 3–5 business days. You'll get an email notification as soon as feedback is posted.",
    },
    {
      id: 3,
      role: "user",
      content: "ok thanks. also i can't access the week 4 videos, it just says 'content unavailable'",
    },
    {
      id: 4,
      role: "assistant",
      content:
        "Sorry about that — we had a brief issue with the video CDN earlier today that's now resolved. Try doing a hard refresh (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac) and the videos should load. If they're still not showing, let me know and I'll escalate it for you.",
    },
  ],
}

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
              {(messagesByNav[activeNav] ?? []).map((msg) =>
                msg.role === "user" ? (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-[82%] rounded-2xl bg-muted px-3.5 py-2.5 text-sm leading-relaxed text-foreground">
                      {msg.content}
                    </div>
                  </div>
                ) : msg.role === "peer" ? (
                  <div key={msg.id} className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-muted-foreground">{msg.name}</span>
                    <div className="max-w-[82%] rounded-2xl bg-accent px-3.5 py-2.5 text-sm leading-relaxed text-foreground">
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
