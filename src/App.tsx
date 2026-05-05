import { useEffect, useRef, useState } from "react"
import { ChevronDown, PanelRight } from "lucide-react"
import { CanvasPane } from "@/components/CanvasPane"
import { ChatPane } from "@/components/ChatPane"
import { ContentPane } from "@/components/ContentPane"

export default function App() {
  const [canvasOpen, setCanvasOpen] = useState(false)
  const [mapOpen, setMapOpen] = useState(false)
  const [chatCollapsed, setChatCollapsed] = useState(false)
  const [panelMenuOpen, setPanelMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setPanelMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative flex h-screen overflow-hidden bg-muted/50">
      <ChatPane
        collapsed={chatCollapsed}
        onCollapsedChange={setChatCollapsed}
        mapOpen={mapOpen}
        onToggleMap={() => setMapOpen((o) => !o)}
      />
      <ContentPane
        mapOpen={mapOpen}
        onToggleMap={() => setMapOpen((o) => !o)}
      />
      {canvasOpen && (
        <CanvasPane
          onClose={() => setCanvasOpen(false)}
          chatCollapsed={chatCollapsed}
        />
      )}

      {/* Panel dropdown — always visible, floats over top-right corner */}
      <div ref={menuRef} className="absolute right-3 top-3 z-50">
        <button
          onClick={() => setPanelMenuOpen((o) => !o)}
          className="flex items-center gap-1 rounded-md px-2 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <PanelRight className="size-4" />
          <ChevronDown className="size-3" />
        </button>

        {panelMenuOpen && (
          <div className="absolute right-0 top-full mt-1 min-w-[130px] rounded-md border border-border bg-background py-1 shadow-lg">
            <button
              onClick={() => {
                setCanvasOpen((o) => !o)
                setPanelMenuOpen(false)
              }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted"
            >
              <PanelRight className={canvasOpen ? "size-3.5 text-muted-foreground" : "size-3.5 text-muted-foreground/40"} />
              <span className={canvasOpen ? "text-muted-foreground" : "text-muted-foreground/40"}>Canvas</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
