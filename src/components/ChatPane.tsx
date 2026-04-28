import { useState } from "react"
import {
  GraduationCap,
  HelpCircle,
  LayoutList,
  MessageSquare,
  Send,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CourseNavigator } from "@/components/CourseNavigator"

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
  const [view, setView] = useState<"chat" | "navigator">("chat")

  return (
    <div
      className={cn(
        "flex flex-shrink-0 flex-col border-r border-stone-200 bg-stone-100 transition-[width] duration-200",
        view === "navigator" ? "w-80" : "w-64",
      )}
    >
      <div className="flex items-center gap-0.5 px-3 pb-2 pt-4">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveNav(id)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
              activeNav === id
                ? "bg-primary/10 text-primary"
                : "text-stone-400 hover:bg-stone-200 hover:text-stone-600",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}

        <button
          onClick={() => setView(view === "navigator" ? "chat" : "navigator")}
          aria-label={view === "navigator" ? "Show chat" : "Show course map"}
          className={cn(
            "ml-auto rounded-lg p-1.5 transition-colors",
            view === "navigator"
              ? "bg-primary/10 text-primary"
              : "text-stone-400 hover:bg-stone-200 hover:text-stone-600",
          )}
        >
          {view === "navigator" ? (
            <MessageSquare className="h-3.5 w-3.5" />
          ) : (
            <LayoutList className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {view === "chat" ? (
        <>
          <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4">
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-3">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-stone-300 text-xs font-semibold text-stone-700">
                  {msg.name[0]}
                </div>
                <div className="min-w-0">
                  <p className="mb-1 text-xs font-semibold text-stone-600">
                    {msg.name}
                  </p>
                  <p className="text-sm leading-relaxed text-stone-500">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="px-3 pb-3">
            <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-transparent text-sm text-stone-700 outline-none placeholder:text-stone-400"
              />
              <button className="text-stone-400 transition-colors hover:text-primary">
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <CourseNavigator onTopicSelect={() => setView("chat")} />
      )}
    </div>
  )
}
