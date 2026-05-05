import { useState } from "react"
import { ChevronDown, PanelRight, X } from "lucide-react"
import { CanvasPane } from "@/components/CanvasPane"
import { ChatPane } from "@/components/ChatPane"
import { ContentPane } from "@/components/ContentPane"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function App() {
  const [canvasOpen, setCanvasOpen] = useState(false)
  const [canvasWidth, setCanvasWidth] = useState(420)
  const [isCanvasResizing, setIsCanvasResizing] = useState(false)
  const [mapOpen, setMapOpen] = useState(false)
  const [chatCollapsed, setChatCollapsed] = useState(false)

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
      <div
        className={cn(
          "flex flex-shrink-0 overflow-hidden",
          !isCanvasResizing && "transition-[width] duration-300 ease-in-out",
        )}
        style={{ width: canvasOpen ? canvasWidth : 0 }}
      >
        <CanvasPane
          onClose={() => setCanvasOpen(false)}
          chatCollapsed={chatCollapsed}
          width={canvasWidth}
          onWidthChange={setCanvasWidth}
          onResizingChange={setIsCanvasResizing}
        />
      </div>

      {/* Panel dropdown — always visible, floats over top-right corner */}
      <div className="absolute right-3 top-2 z-50 flex h-14 items-center">
        {canvasOpen && (
          <>
            <button
              onClick={() => setCanvasOpen(false)}
              className="flex items-center justify-center rounded-md px-2 py-1.5 text-foreground transition-colors hover:bg-black/10"
            >
              <X className="size-4" />
            </button>
            <div className="mx-0.5 h-4 w-px bg-border" />
          </>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger className="group/trigger flex items-center gap-1 rounded-md px-2 py-1.5 text-foreground transition-colors hover:bg-black/10 outline-none">
            <PanelRight className="size-4" />
            <ChevronDown className="size-3 rotate-180 transition-transform group-data-[state=open]/trigger:rotate-0" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={2} className="min-w-[130px]">
            <DropdownMenuCheckboxItem
              checked={canvasOpen}
              onCheckedChange={setCanvasOpen}
            >
              <PanelRight className="size-3.5" />
              Canvas
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
