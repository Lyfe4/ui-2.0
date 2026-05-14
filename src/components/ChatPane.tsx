import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import {
  ChevronLeft,
  Globe,
  HelpCircle,
  MessageCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Reply,
  Send,
  Sparkles,
  Users,
  Users2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

// ─── Types ───────────────────────────────────────────────────────────────────

type SocialSubTab = "units" | "groups" | "direct"

type UserStatus = "online" | "away" | "dnd" | "offline"

interface Conversation {
  id: string
  name: string
  lastMessage: string
  time: string
  unread?: number
  initials: string
  status?: UserStatus
  isGlobal?: boolean
}

type ChatMessage = {
  id: number
  role: "user" | "assistant" | "peer"
  name?: string
  content: string
  time?: string
}

interface ThreadReply {
  id: number
  name: string
  content: string
  time: string
}

interface StoredThreadMessage {
  id: string
  content: string
  time: string
}

// ─── Mock data: Learn / Support ───────────────────────────────────────────────

const messagesByNav: Record<string, ChatMessage[]> = {
  learn: [
    { id: 1, role: "user", content: "can you explain how the immune system recognises pathogens?" },
    {
      id: 2,
      role: "assistant",
      content:
        "Your immune system uses two main strategies.\n\nThe innate system is fast and non-specific — it spots molecular patterns shared across many pathogens, like bacterial cell-wall components, and mounts an immediate response.\n\nThe adaptive system is slower but precise. B and T cells carry receptors that match specific antigens. When a match is found those cells multiply and attack — and a small pool persists as memory cells, which is why you respond faster to something you've encountered before.",
    },
    { id: 3, role: "user", content: "what happens when it makes a mistake?" },
    {
      id: 4,
      role: "assistant",
      content:
        "Two main failure modes.\n\nAutoimmunity is when the adaptive system targets your own tissue — it mistakes self for non-self. Type 1 diabetes, lupus, and multiple sclerosis all work this way.\n\nAllergies are the innate system overreacting to harmless substances. Pollen, peanuts, dust mites — not threats, but in some people the immune system treats them like pathogens and fires off a disproportionate response.",
    },
    { id: 5, role: "user", content: "how does vaccination fit into all this?" },
    {
      id: 6,
      role: "assistant",
      content:
        "Vaccines exploit the adaptive system's memory.\n\nThey introduce an antigen — or instructions to make one — without a live infection. Your body mounts a response, generates memory B and T cells, and then clears it. If you encounter the real pathogen later, those memory cells let you respond fast enough to stop an illness from taking hold.\n\nDifferent vaccine types get the antigen in differently: live-attenuated vaccines use a weakened pathogen, subunit vaccines use just a protein fragment, and mRNA vaccines (like the COVID-19 ones) give your cells temporary instructions to produce the antigen themselves.",
    },
    { id: 7, role: "user", content: "why do some vaccines need boosters but others don't?" },
    {
      id: 8,
      role: "assistant",
      content:
        "It comes down to how long the memory response lasts, and how fast the pathogen mutates.\n\nSome vaccines — like the MMR for measles — produce a strong, durable immune memory that lasts decades, often a lifetime. Others, like flu shots, need annual updates because the influenza virus mutates so rapidly that last year's memory cells no longer recognise this year's strains.\n\nBoosters can also be needed when the initial response fades faster than expected — antibody levels drop over time, and a booster restimulates the memory cells to top them back up.",
    },
    { id: 9, role: "user", content: "that makes sense. what's herd immunity then?" },
    {
      id: 10,
      role: "assistant",
      content:
        "Herd immunity is when enough people in a population are immune that transmission chains break on their own — the pathogen can't find enough susceptible hosts to keep spreading.\n\nThe threshold varies by how contagious the disease is. Measles is extremely transmissible, so you need roughly 95% immunity to stop outbreaks. Polio needs around 80–85%.\n\nIt matters because not everyone can be vaccinated — newborns, people with certain immune conditions, or those undergoing chemotherapy rely on the people around them being immune to stay protected.",
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

// ─── Mock data: Social conversations ─────────────────────────────────────────

const unitConversations: Conversation[] = [
  {
    id: "townsquare",
    name: "Town Square",
    lastMessage: "Priya: Anyone excited for tomorrow's guest lecture?",
    time: "2m",
    unread: 3,
    initials: "TS",
    isGlobal: true,
  },
  {
    id: "biol201",
    name: "BIOL 201 · Cell Biology",
    lastMessage: "Maya: Chapter 8 notes are up!",
    time: "14m",
    unread: 1,
    initials: "B2",
  },
  {
    id: "chem101",
    name: "CHEM 101 · Intro Chemistry",
    lastMessage: "Jordan: See you all Thursday",
    time: "1h",
    initials: "C1",
  },
  {
    id: "math210",
    name: "MATH 210 · Calculus II",
    lastMessage: "You: Thanks for the help!",
    time: "3h",
    initials: "M2",
  },
]

const groupConversations: Conversation[] = [
  {
    id: "midterm-study",
    name: "Midterm Study Group",
    lastMessage: "Jordan: Thursday 6pm library?",
    time: "5m",
    unread: 2,
    initials: "MS",
  },
  {
    id: "lab-partners",
    name: "Lab Partners",
    lastMessage: "Priya: Got the reagents sorted",
    time: "2h",
    initials: "LP",
  },
  {
    id: "thesis-crew",
    name: "Thesis Writing Crew",
    lastMessage: "You: Draft is due Friday",
    time: "1d",
    initials: "TW",
  },
]

const dmConversations: Conversation[] = [
  {
    id: "maya",
    name: "Maya Chen",
    lastMessage: "See you Thursday!",
    time: "2m",
    unread: 1,
    initials: "MC",
    status: "online",
  },
  {
    id: "jordan",
    name: "Jordan Kim",
    lastMessage: "No problem! I found a great MAPK article too",
    time: "30m",
    initials: "JK",
    status: "away",
  },
  {
    id: "dr-patel",
    name: "Dr. Patel",
    lastMessage: "Office hours moved to 3 pm today",
    time: "2h",
    initials: "DP",
    status: "dnd",
  },
  {
    id: "priya",
    name: "Priya Sharma",
    lastMessage: "Good luck on the midterm!",
    time: "1d",
    initials: "PS",
    status: "offline",
  },
]

const conversationsByTab: Record<SocialSubTab, Conversation[]> = {
  units: unitConversations,
  groups: groupConversations,
  direct: dmConversations,
}

// ─── Mock data: Social message threads ───────────────────────────────────────

const conversationMessages: Record<string, ChatMessage[]> = {
  townsquare: [
    { id: 1, role: "peer", name: "Alex", content: "Good morning everyone! Ready for today's lecture?", time: "9:02 AM" },
    { id: 2, role: "peer", name: "Maya", content: "Yeah, I've been reading ahead on chapter 9. Active transport is fascinating.", time: "9:05 AM" },
    { id: 3, role: "peer", name: "Jordan", content: "Anyone else think the guest lecturer last week was amazing? Dr. Rivera's research on membrane proteins was incredible.", time: "9:11 AM" },
    { id: 4, role: "user", content: "Agreed! Does anyone know if the recording will be posted?", time: "9:14 AM" },
    { id: 5, role: "peer", name: "Alex", content: "I think they're uploading it this afternoon — check the announcements section.", time: "9:15 AM" },
    { id: 6, role: "peer", name: "Priya", content: "Anyone excited for tomorrow's guest lecture?", time: "11:30 AM" },
  ],
  biol201: [
    { id: 1, role: "peer", name: "Maya", content: "has anyone started the cell signalling unit? completely lost on receptor kinases", time: "10:20 AM" },
    { id: 2, role: "peer", name: "Jordan", content: "yeah i did it last week — the Khan Academy video on RTKs is really good, way clearer than the textbook", time: "10:22 AM" },
    { id: 3, role: "user", content: "thanks, i'll check it out. are we doing a study group before the midterm?", time: "10:25 AM" },
    { id: 4, role: "peer", name: "Maya", content: "Chapter 8 notes are up! Just posted them in the resources section.", time: "2:14 PM" },
  ],
  chem101: [
    { id: 1, role: "peer", name: "Sam", content: "reminder — lab report due by midnight tonight", time: "8:00 AM" },
    { id: 2, role: "user", content: "thanks for the reminder! almost forgot", time: "8:45 AM" },
    { id: 3, role: "peer", name: "Jordan", content: "See you all Thursday for the titration lab", time: "1:00 PM" },
  ],
  math210: [
    { id: 1, role: "peer", name: "Sam", content: "can anyone explain integration by parts? the textbook example isn't clicking", time: "Yesterday" },
    { id: 2, role: "peer", name: "Priya", content: "think of it as the reverse product rule — LIATE helps pick u and dv", time: "Yesterday" },
    { id: 3, role: "user", content: "Thanks for the help!", time: "Yesterday" },
  ],
  "midterm-study": [
    { id: 1, role: "peer", name: "Jordan", content: "Hey everyone, should we meet this week to prep for the midterm?", time: "Yesterday" },
    { id: 2, role: "peer", name: "Maya", content: "Definitely! Thursday evening?", time: "Yesterday" },
    { id: 3, role: "user", content: "Thursday works. Library study room?", time: "Yesterday" },
    { id: 4, role: "peer", name: "Jordan", content: "Thursday 6pm library? I'll book the room.", time: "8:00 AM" },
    { id: 5, role: "peer", name: "Maya", content: "Perfect. I'll bring practice exams from the last 3 years.", time: "8:30 AM" },
  ],
  "lab-partners": [
    { id: 1, role: "peer", name: "Priya", content: "I booked the lab bench for Wednesday 2–4pm", time: "Mon" },
    { id: 2, role: "user", content: "Great, I'll bring my protocol notes", time: "Mon" },
    { id: 3, role: "peer", name: "Priya", content: "Got the reagents sorted — we're all set!", time: "2h ago" },
  ],
  "thesis-crew": [
    { id: 1, role: "peer", name: "Sam", content: "how is everyone's lit review going?", time: "Mon" },
    { id: 2, role: "peer", name: "Alex", content: "slowly but surely. found some great papers on JSTOR", time: "Mon" },
    { id: 3, role: "user", content: "Draft is due Friday, almost there", time: "1d ago" },
  ],
  maya: [
    { id: 1, role: "peer", name: "Maya", content: "Did you understand the receptor phosphorylation part from today's lecture?", time: "Mon" },
    { id: 2, role: "user", content: "Kind of, but the cascade after the initial activation confused me.", time: "Mon" },
    { id: 3, role: "peer", name: "Maya", content: "Same! Want to compare notes after I re-watch the recording?", time: "Mon" },
    { id: 4, role: "user", content: "Yes! Also are you going to the study group Thursday?", time: "2:30 PM" },
    { id: 5, role: "peer", name: "Maya", content: "See you Thursday!", time: "2:45 PM" },
  ],
  jordan: [
    { id: 1, role: "peer", name: "Jordan", content: "The RTK video was helpful right? Told you Khan Academy was good for this stuff", time: "11:00 AM" },
    { id: 2, role: "user", content: "Yeah it was really clear. Thanks for the rec!", time: "11:05 AM" },
    { id: 3, role: "peer", name: "Jordan", content: "No problem! I also found a great article on the MAPK pathway if you want the link", time: "11:20 AM" },
  ],
  "dr-patel": [
    { id: 1, role: "peer", name: "Dr. Patel", content: "Just a heads up — office hours today are moved to 3 pm.", time: "9:00 AM" },
    { id: 2, role: "user", content: "Thanks for letting me know!", time: "9:10 AM" },
  ],
  priya: [
    { id: 1, role: "user", content: "Good luck on your exam today!", time: "Yesterday" },
    { id: 2, role: "peer", name: "Priya", content: "Thank you so much! You too when yours comes up.", time: "Yesterday" },
    { id: 3, role: "peer", name: "Priya", content: "Good luck on the midterm!", time: "1d ago" },
  ],
}

// ─── Mock data: Thread replies (keyed by conversation id → message id) ────────

const mockThreadReplies: Record<string, Record<number, ThreadReply[]>> = {
  townsquare: {
    3: [
      { id: 1, name: "You", content: "I was there! The part about protein folding was especially good.", time: "9:12 AM" },
      { id: 2, name: "Maya", content: "Yes! And the Q&A at the end was so insightful.", time: "9:13 AM" },
    ],
  },
  biol201: {
    2: [
      { id: 1, name: "You", content: "Which one exactly? There are a few on RTKs", time: "10:23 AM" },
      { id: 2, name: "Jordan", content: "The one titled 'Signal Transduction Pathways' — about 18 mins", time: "10:24 AM" },
    ],
  },
  "midterm-study": {
    4: [
      { id: 1, name: "Maya", content: "I can get there around 5:45 to help set up", time: "8:15 AM" },
    ],
    5: [
      { id: 1, name: "Jordan", content: "Maybe also some flashcards on the harder topics?", time: "8:35 AM" },
      { id: 2, name: "You", content: "Great idea, I'll make some tonight", time: "8:40 AM" },
    ],
  },
  maya: {
    3: [
      { id: 1, name: "You", content: "That would be great! I'll message you when I finish watching", time: "Mon" },
    ],
  },
}

// ─── Static config ────────────────────────────────────────────────────────────

const navItems = [
  { id: "learn", label: "Learn", icon: Sparkles },
  { id: "social", label: "Social", icon: Users },
  { id: "support", label: "Support", icon: HelpCircle },
]

const socialSubTabs: { id: SocialSubTab; label: string; icon: React.ElementType }[] = [
  { id: "units", label: "Units", icon: Users },
  { id: "groups", label: "Groups", icon: Users2 },
  { id: "direct", label: "Direct", icon: MessageCircle },
]

const allConversations = [...unitConversations, ...groupConversations, ...dmConversations]

const statusConfig: Record<UserStatus, { dot: string; label: string; short: string; text: string }> = {
  online:  { dot: "bg-status-online",       label: "Online",         short: "Online",  text: "text-primary-accessible dark:text-primary" },
  away:    { dot: "bg-warning",             label: "Away",           short: "Away",    text: "text-status-away-text"                    },
  dnd:     { dot: "bg-destructive",         label: "Do not disturb", short: "DND",     text: "text-destructive"                         },
  offline: { dot: "bg-muted-foreground/40", label: "Offline",        short: "Offline", text: "text-muted-foreground"                    },
}

const MIN_WIDTH = 260
const MAX_WIDTH = 560
const DEFAULT_WIDTH = 384

// ─── Component ────────────────────────────────────────────────────────────────

interface ChatPaneProps {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
}

export function ChatPane({ collapsed, onCollapsedChange }: ChatPaneProps) {
  const [input, setInput] = useState("")
  const [threadInput, setThreadInput] = useState("")
  const [activeNav, setActiveNav] = useState("learn")
  const [socialSubTab, setSocialSubTab] = useState<SocialSubTab>("units")
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [openThreadId, setOpenThreadId] = useState<number | null>(null)
  const [localThreadMessages, setLocalThreadMessages] = useState<Record<string, StoredThreadMessage[]>>({})
  const [width, setWidth] = useState(DEFAULT_WIDTH)
  const [isResizing, setIsResizing] = useState(false)

  // Main nav indicator
  const startX = useRef(0)
  const startWidth = useRef(0)
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])
  const navRef = useRef<HTMLDivElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const activeNavRef = useRef(activeNav)
  activeNavRef.current = activeNav

  // Social sub-tab indicator
  const socialTabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const socialTabsRef = useRef<HTMLDivElement | null>(null)
  const [socialIndicatorStyle, setSocialIndicatorStyle] = useState({ left: 0, width: 0 })
  const socialSubTabRef = useRef(socialSubTab)
  socialSubTabRef.current = socialSubTab

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

  useEffect(() => {
    try {
      const stored = localStorage.getItem("lyfe-chat-threads")
      if (stored) setLocalThreadMessages(JSON.parse(stored))
    } catch {}
  }, [])

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

  // ── Main nav indicator ──────────────────────────────────────────────────────

  const measureIndicator = useCallback(() => {
    const activeIndex = navItems.findIndex(item => item.id === activeNavRef.current)
    const btn = buttonRefs.current[activeIndex]
    if (btn) setIndicatorStyle({ left: btn.offsetLeft, width: btn.offsetWidth })
  }, [])

  useLayoutEffect(() => {
    measureIndicator()
  }, [activeNav, visuallyCollapsed, measureIndicator])

  useEffect(() => {
    if (visuallyCollapsed || !navRef.current) return
    const observer = new ResizeObserver(measureIndicator)
    observer.observe(navRef.current)
    return () => observer.disconnect()
  }, [visuallyCollapsed, measureIndicator])

  // ── Social sub-tab indicator ────────────────────────────────────────────────

  const measureSocialIndicator = useCallback(() => {
    const activeIndex = socialSubTabs.findIndex(t => t.id === socialSubTabRef.current)
    const btn = socialTabRefs.current[activeIndex]
    if (btn) setSocialIndicatorStyle({ left: btn.offsetLeft, width: btn.offsetWidth })
  }, [])

  useLayoutEffect(() => {
    if (activeNav !== "social" || selectedConversation !== null) return
    measureSocialIndicator()
  }, [socialSubTab, activeNav, selectedConversation, measureSocialIndicator])

  useEffect(() => {
    if (activeNav !== "social" || selectedConversation !== null || !socialTabsRef.current) return
    const observer = new ResizeObserver(measureSocialIndicator)
    observer.observe(socialTabsRef.current)
    return () => observer.disconnect()
  }, [activeNav, selectedConversation, measureSocialIndicator])

  // ── Helpers ─────────────────────────────────────────────────────────────────

  function handleNavClick(id: string) {
    setActiveNav(id)
    setSelectedConversation(null)
    setOpenThreadId(null)
  }

  function handleSelectConversation(id: string) {
    setSelectedConversation(id)
    setOpenThreadId(null)
  }

  function toggleThread(id: number) {
    setOpenThreadId(prev => (prev === id ? null : id))
    setThreadInput("")
  }

  function sendThreadReply(msgId: number) {
    if (!threadInput.trim() || !selectedConversation) return
    const key = `${selectedConversation}:${msgId}`
    const newMsg: StoredThreadMessage = {
      id: crypto.randomUUID(),
      content: threadInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    const updated = {
      ...localThreadMessages,
      [key]: [...(localThreadMessages[key] ?? []), newMsg],
    }
    setLocalThreadMessages(updated)
    localStorage.setItem("lyfe-chat-threads", JSON.stringify(updated))
    setThreadInput("")
  }

  const activeConversation = selectedConversation
    ? allConversations.find(c => c.id === selectedConversation) ?? null
    : null

  const currentThreadReplies: Record<number, ThreadReply[]> = selectedConversation
    ? (mockThreadReplies[selectedConversation] ?? {})
    : {}

  // ── Render helpers ──────────────────────────────────────────────────────────

  function renderThreadPanel(msgId: number) {
    const mockReplies = currentThreadReplies[msgId] ?? []
    const threadKey = selectedConversation ? `${selectedConversation}:${msgId}` : ""
    const storedReplies = localThreadMessages[threadKey] ?? []
    return (
      <div className="mt-2 ml-3 flex flex-col gap-2 border-l-2 border-border/40 pl-3">
        {mockReplies.map((reply) => (
          <div key={reply.id} className="flex flex-col gap-0.5">
            <span className="text-[11px] font-medium text-muted-foreground">{reply.name}</span>
            <div className="rounded-xl bg-muted/60 px-2.5 py-1.5 text-xs leading-relaxed text-foreground">
              {reply.content}
            </div>
            <span className="text-[10px] text-muted-foreground">{reply.time}</span>
          </div>
        ))}
        {storedReplies.map((reply) => (
          <div key={reply.id} className="flex flex-col items-end gap-0.5">
            <span className="text-[11px] font-medium text-muted-foreground">You</span>
            <div className="rounded-xl bg-muted px-2.5 py-1.5 text-xs leading-relaxed text-foreground">
              {reply.content}
            </div>
            <span className="text-[10px] text-muted-foreground">{reply.time}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5">
          <Input
            value={threadInput}
            onChange={(e) => setThreadInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendThreadReply(msgId) } }}
            placeholder="Reply in thread…"
            className="min-w-0 flex-1 border-0 bg-transparent px-0 py-0.5 text-xs leading-4 shadow-none focus-visible:ring-0"
          />
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Send thread reply"
            onClick={() => sendThreadReply(msgId)}
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            <Send className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )
  }

  function renderThreadHint(msgId: number) {
    const threadKey = selectedConversation ? `${selectedConversation}:${msgId}` : ""
    const count = (currentThreadReplies[msgId]?.length ?? 0) + (localThreadMessages[threadKey]?.length ?? 0)
    if (!count || openThreadId === msgId) return null
    return (
      <Button
        variant="link"
        onClick={() => toggleThread(msgId)}
        className="mt-0.5 h-auto px-0 py-0 text-[10px] font-medium leading-none text-primary"
      >
        {count} {count === 1 ? "reply" : "replies"}
      </Button>
    )
  }

  function renderConversationItem(conv: Conversation) {
    return (
      <button
        onClick={() => handleSelectConversation(conv.id)}
        className={cn(
          "flex w-full items-center text-left transition-colors hover:bg-muted/60",
          width < 320 ? "gap-2 px-2 py-2" : "gap-3 px-3 py-2.5",
        )}
      >
        {/* Avatar with presence dot */}
        <div className="relative shrink-0">
          <Avatar className={width < 320 ? "h-8 w-8" : "h-9 w-9"}>
            <AvatarFallback
              className={cn(
                "font-semibold",
                width < 320 ? "text-[10px]" : "text-xs",
                conv.isGlobal ? "bg-primary/10 text-primary" : "bg-accent text-foreground",
              )}
            >
              {conv.isGlobal
                ? <Globe className={width < 320 ? "h-3.5 w-3.5" : "h-4 w-4"} />
                : conv.initials}
            </AvatarFallback>
          </Avatar>
          {conv.status && (
            <span
              aria-label={statusConfig[conv.status].label}
              className={cn(
                "absolute bottom-0 right-0 rounded-full ring-2 ring-background",
                width < 320 ? "h-2 w-2" : "h-2.5 w-2.5",
                statusConfig[conv.status].dot,
              )}
            />
          )}
        </div>

        {/* Name / time / preview / badge */}
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-baseline justify-between gap-1">
            <span className={cn(
              "min-w-0 truncate font-medium text-foreground",
              width < 320 ? "text-xs" : "text-sm",
              conv.unread && "font-semibold",
            )}>
              {conv.name}
            </span>
            <span className={cn(
              "shrink-0 text-muted-foreground",
              width < 320 ? "text-[10px]" : "text-xs",
            )}>
              {conv.time}
            </span>
          </div>
          {width >= 290 && (
            <div className="mt-0.5 flex min-w-0 items-center justify-between gap-2">
              <span className="min-w-0 truncate text-xs text-muted-foreground">{conv.lastMessage}</span>
              {conv.unread && <Badge variant="notification">{conv.unread}</Badge>}
            </div>
          )}
          {width < 290 && conv.unread && (
            <Badge variant="notification" className="mt-0.5">{conv.unread}</Badge>
          )}
        </div>
      </button>
    )
  }

  function renderMessages(messages: ChatMessage[], inConversation: boolean) {
    return messages.map((msg) =>
      msg.role === "user" ? (
        <div key={msg.id} className="group flex flex-col gap-0.5">
          <div className="flex items-center justify-end gap-2">
            {inConversation && (
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => toggleThread(msg.id)}
                aria-label="Reply in thread"
                aria-pressed={openThreadId === msg.id}
                className={cn(
                  "transition-all duration-150",
                  openThreadId === msg.id
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100",
                )}
              >
                <Reply className="h-3 w-3" />
              </Button>
            )}
            <div className="max-w-[78%] rounded-2xl bg-muted px-3.5 py-2.5 text-sm leading-relaxed text-foreground">
              {msg.content}
              {msg.time && inConversation && (
                <div className="mt-1 select-none text-right text-[10px] leading-none text-foreground/40 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  {msg.time}
                </div>
              )}
            </div>
          </div>
          {inConversation && renderThreadHint(msg.id)}
          {inConversation && openThreadId === msg.id && renderThreadPanel(msg.id)}
        </div>
      ) : msg.role === "peer" ? (
        <div key={msg.id} className="group flex flex-col gap-0.5">
          <span className="text-xs font-medium text-muted-foreground">{msg.name}</span>
          <div className="flex items-center gap-2">
            <div className="max-w-[78%] rounded-2xl bg-accent px-3.5 py-2.5 text-sm leading-relaxed text-foreground">
              {msg.content}
              {msg.time && inConversation && (
                <div className="mt-1 select-none text-right text-[10px] leading-none text-foreground/40 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  {msg.time}
                </div>
              )}
            </div>
            {inConversation && (
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => toggleThread(msg.id)}
                aria-label="Reply in thread"
                aria-pressed={openThreadId === msg.id}
                className={cn(
                  "transition-all duration-150",
                  openThreadId === msg.id
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100",
                )}
              >
                <Reply className="h-3 w-3" />
              </Button>
            )}
          </div>
          {inConversation && renderThreadHint(msg.id)}
          {inConversation && openThreadId === msg.id && renderThreadPanel(msg.id)}
        </div>
      ) : (
        <div key={msg.id} className="flex flex-col gap-3 text-sm leading-relaxed text-foreground">
          {msg.content.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      )
    )
  }

  function renderInput() {
    return (
      <div className="px-3 pb-3">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-muted px-3 py-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="min-w-0 flex-1 border-0 bg-transparent px-1 py-0 h-auto shadow-none focus-visible:ring-0"
          />
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Send message"
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            <Send />
          </Button>
        </div>
      </div>
    )
  }

  // ── JSX ─────────────────────────────────────────────────────────────────────

  return (
    <div
      className={cn(
        "relative flex flex-shrink-0 flex-col rounded-r-2xl bg-background border border-border shadow-panel-outset my-2 overflow-hidden",
        !isResizing && "transition-[width] duration-300 ease-in-out",
      )}
      style={{ width: collapsed ? 48 : width }}
    >
        {visuallyCollapsed ? (
          /* ── Collapsed icon rail ── */
          <div className="flex w-12 flex-col items-center px-1 pb-3">
            <div className="flex h-14 items-center justify-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Expand chat"
                    onClick={() => onCollapsedChange(false)}
                  >
                    <PanelLeftOpen className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Expand chat</TooltipContent>
              </Tooltip>
            </div>
            <div className="flex flex-col gap-1">
              {navItems.map(({ id, label, icon: Icon }) => (
                <Tooltip key={id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={label}
                      onClick={() => {
                        handleNavClick(id)
                        onCollapsedChange(false)
                      }}
                    >
                      <Icon />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">{label}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* ── Expanded view ── */}
            <Tabs
              value={activeNav}
              onValueChange={handleNavClick}
              className="flex flex-1 flex-col overflow-hidden"
            >
              {/* Main nav row */}
              <div className="flex h-14 shrink-0 items-center gap-2 px-2.5">
                <TabsList
                  ref={navRef as React.RefObject<HTMLDivElement>}
                  className="relative flex h-auto flex-1 items-center gap-1 rounded-xl bg-muted p-1"
                >
                  {/* Sliding pill indicator */}
                  <div
                    aria-hidden
                    className="absolute rounded-lg bg-background shadow-sm transition-all duration-200 ease-in-out"
                    style={{ left: indicatorStyle.left, width: indicatorStyle.width, top: 4, bottom: 4 }}
                  />
                  {navItems.map(({ id, label, icon: Icon }, index) => (
                    <TabsTrigger
                      key={id}
                      value={id}
                      ref={(el) => { buttonRefs.current[index] = el as HTMLButtonElement | null }}
                      className={cn(
                        "relative flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors duration-150",
                        activeNav === id
                          ? "text-foreground"
                          : "text-muted-foreground hover:bg-surface-hover hover:text-foreground",
                      )}
                    >
                      <Icon className="h-3 w-3 shrink-0" />
                      {width >= 300 && <span>{label}</span>}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Collapse chat"
                      onClick={() => onCollapsedChange(true)}
                    >
                      <PanelLeftClose className="size-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">Collapse chat</TooltipContent>
                </Tooltip>
              </div>

              {/* ── Learn tab ── */}
              <TabsContent value="learn" className="flex flex-1 flex-col overflow-hidden">
                <ScrollArea className="flex-1" viewportProps={{ tabIndex: 0 }}>
                  <div className={cn("flex flex-col gap-6 py-5", width < 320 ? "px-3" : "px-4")}>
                    {renderMessages(messagesByNav["learn"] ?? [], false)}
                  </div>
                </ScrollArea>
                {renderInput()}
              </TabsContent>

              {/* ── Social tab ── */}
              <TabsContent value="social" className="flex flex-1 flex-col overflow-hidden">
                {selectedConversation === null ? (
                  /* Conversation list with sub-tabs */
                  <Tabs
                    value={socialSubTab}
                    onValueChange={(v) => setSocialSubTab(v as SocialSubTab)}
                    className="flex flex-1 flex-col overflow-hidden"
                  >
                    <TabsList
                      ref={socialTabsRef as React.RefObject<HTMLDivElement>}
                      className="relative flex h-auto shrink-0 rounded-none border-b border-border bg-transparent p-0"
                    >
                      {/* Sliding underline indicator */}
                      <div
                        aria-hidden
                        className="absolute bottom-0 h-0.5 bg-primary transition-all duration-200 ease-in-out"
                        style={{ left: socialIndicatorStyle.left, width: socialIndicatorStyle.width }}
                      />
                      {socialSubTabs.map(({ id, label, icon: Icon }, index) => (
                        <TabsTrigger
                          key={id}
                          value={id}
                          ref={(el) => { socialTabRefs.current[index] = el as HTMLButtonElement | null }}
                          className={cn(
                            "flex flex-1 items-center justify-center py-2.5 text-xs font-medium transition-colors duration-150",
                            width >= 300 ? "gap-1.5" : "gap-0",
                            socialSubTab === id
                              ? "text-foreground"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          <Icon className="h-3 w-3 shrink-0" />
                          {width >= 300 && <span>{label}</span>}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {(["units", "groups", "direct"] as SocialSubTab[]).map((tab) => (
                      <TabsContent key={tab} value={tab} className="flex flex-1 flex-col overflow-hidden">
                        <ScrollArea className="flex-1" viewportProps={{ tabIndex: 0 }}>
                          <ul role="list" className="py-1">
                            {conversationsByTab[tab].map((conv) => (
                              <li key={conv.id}>{renderConversationItem(conv)}</li>
                            ))}
                          </ul>
                        </ScrollArea>
                      </TabsContent>
                    ))}
                  </Tabs>
                ) : (
                  /* Conversation thread */
                  <>
                    {activeConversation && (
                      <div className="flex shrink-0 items-center gap-2 border-b border-border px-2 py-2">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          aria-label="Back to conversations"
                          onClick={() => setSelectedConversation(null)}
                        >
                          <ChevronLeft className="size-3.5" />
                        </Button>
                        <div className="relative">
                          <Avatar className="h-6 w-6 shrink-0">
                            <AvatarFallback
                              className={cn(
                                "text-[10px] font-semibold",
                                activeConversation.isGlobal
                                  ? "bg-primary/10 text-primary"
                                  : "bg-accent text-foreground",
                              )}
                            >
                              {activeConversation.isGlobal
                                ? <Globe className="h-3 w-3" />
                                : activeConversation.initials}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <span className="truncate text-sm font-medium text-foreground">
                            {activeConversation.name}
                          </span>
                          {activeConversation.status && (
                            <div className="flex items-center gap-1">
                              <span
                                aria-hidden
                                className={cn(
                                  "h-1.5 w-1.5 shrink-0 rounded-full",
                                  statusConfig[activeConversation.status].dot,
                                )}
                              />
                              <span className={cn("text-[10px] font-medium", statusConfig[activeConversation.status].text)}>
                                {width < 340
                                  ? statusConfig[activeConversation.status].short
                                  : statusConfig[activeConversation.status].label}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <ScrollArea className="flex-1" viewportProps={{ tabIndex: 0 }}>
                      <div className={cn("flex flex-col gap-6 py-5", width < 320 ? "px-3" : "px-4")}>
                        {renderMessages(conversationMessages[selectedConversation!] ?? [], true)}
                      </div>
                    </ScrollArea>
                    {renderInput()}
                  </>
                )}
              </TabsContent>

              {/* ── Support tab ── */}
              <TabsContent value="support" className="flex flex-1 flex-col overflow-hidden">
                <ScrollArea className="flex-1" viewportProps={{ tabIndex: 0 }}>
                  <div className={cn("flex flex-col gap-6 py-5", width < 320 ? "px-3" : "px-4")}>
                    {renderMessages(messagesByNav["support"] ?? [], false)}
                  </div>
                </ScrollArea>
                {renderInput()}
              </TabsContent>
            </Tabs>

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
