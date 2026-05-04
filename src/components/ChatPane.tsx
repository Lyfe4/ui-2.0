import { useState } from "react"
import {
  GraduationCap,
  HelpCircle,
  LayoutList,
  PanelLeftClose,
  PanelLeftOpen,
  Send,
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
  { id: "learn", label: "Learn", icon: GraduationCap },
  { id: "social", label: "Social", icon: Users },
  { id: "support", label: "Support", icon: HelpCircle },
]

interface ChatPaneProps {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
  mapOpen: boolean
  onToggleMap: () => void
}

export function ChatPane({ collapsed, onCollapsedChange, mapOpen, onToggleMap }: ChatPaneProps) {
  const [input, setInput] = useState("")
  const [activeNav, setActiveNav] = useState("learn")

  if (collapsed) {
    return (
      <div className="flex w-12 flex-shrink-0 flex-col items-center gap-1 rounded-r-2xl bg-background shadow-[2px_0_12px_-2px_rgba(0,0,0,0.08)] my-2 px-1 pt-4 pb-3">
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

          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Navigate"
            title="Navigate"
            aria-pressed={mapOpen}
            onClick={onToggleMap}
            className={cn(
              mapOpen && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
            )}
          >
            <LayoutList />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-72 sm:w-96 flex-shrink-0 flex-col rounded-r-2xl bg-background shadow-[2px_0_12px_-2px_rgba(0,0,0,0.08)] my-2">
      <div className="flex items-center gap-1 px-3 pb-2 pt-4">
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

        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Navigate"
          title="Navigate"
          aria-pressed={mapOpen}
          onClick={onToggleMap}
          className={cn(
            mapOpen && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
          )}
        >
          <LayoutList />
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Collapse chat"
          title="Collapse chat"
          onClick={() => onCollapsedChange(true)}
          className="ml-auto"
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
    </div>
  )
}
