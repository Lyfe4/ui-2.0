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
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
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
        "flex flex-shrink-0 flex-col border-r border-border bg-muted transition-[width] duration-200",
        view === "navigator" ? "w-80" : "w-64",
      )}
    >
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
              activeNav === id && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
            )}
          >
            <Icon />
          </Button>
        ))}

        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={view === "navigator" ? "Show chat" : "Show course map"}
          title={view === "navigator" ? "Show chat" : "Show course map"}
          aria-pressed={view === "navigator"}
          onClick={() => setView(view === "navigator" ? "chat" : "navigator")}
          className={cn(
            "ml-auto",
            view === "navigator" && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
          )}
        >
          {view === "navigator" ? <MessageSquare /> : <LayoutList />}
        </Button>
      </div>

      {view === "chat" ? (
        <>
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
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <Button variant="ghost" size="icon-xs" aria-label="Send">
                <Send />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <CourseNavigator onTopicSelect={() => setView("chat")} />
      )}
    </div>
  )
}
