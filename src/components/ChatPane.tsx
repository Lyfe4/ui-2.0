import { useState } from "react"
import { GraduationCap, Users, HelpCircle, Send } from "lucide-react"
import { cn } from "@/lib/utils"

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

export function ChatPane() {
  const [input, setInput] = useState("")
  const [activeNav, setActiveNav] = useState("learn")

  return (
    <div className="flex w-72 flex-shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="flex items-center gap-1 border-b border-border px-3 py-3">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveNav(id)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
              activeNav === id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-3">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">
              {msg.name[0]}
            </div>
            <div className="min-w-0">
              <p className="mb-1 text-xs font-semibold text-foreground">{msg.name}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2 rounded-full border border-input bg-background px-4 py-2.5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button className="text-muted-foreground transition-colors hover:text-foreground">
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
