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
    <div className="flex w-64 flex-shrink-0 flex-col bg-zinc-950 text-zinc-100">
      <div className="flex items-center gap-0.5 px-3 pb-2 pt-4">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveNav(id)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
              activeNav === id
                ? "bg-zinc-800 text-zinc-100"
                : "text-zinc-500 hover:text-zinc-300",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-4 py-4">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-3">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-zinc-700 text-xs font-semibold text-zinc-100">
              {msg.name[0]}
            </div>
            <div className="min-w-0">
              <p className="mb-1 text-xs font-semibold text-zinc-300">{msg.name}</p>
              <p className="text-sm leading-relaxed text-zinc-400">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-3 pb-4">
        <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
          />
          <button className="text-zinc-600 transition-colors hover:text-zinc-300">
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
