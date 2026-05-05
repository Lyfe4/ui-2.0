import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronDown, ClipboardList, PanelRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AssignmentPane } from "@/components/AssignmentPane"
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

const MIN_COLUMN_WIDTH = 280
const MAX_COLUMN_WIDTH = 720
const DEFAULT_COLUMN_WIDTH = 420

export default function App() {
  const [canvasOpen, setCanvasOpen] = useState(false)
  const [assignmentOpen, setAssignmentOpen] = useState(false)
  const [mapOpen, setMapOpen] = useState(false)
  const [chatCollapsed, setChatCollapsed] = useState(false)

  const [rightColumnWidth, setRightColumnWidth] = useState(DEFAULT_COLUMN_WIDTH)
  const [isColumnResizing, setIsColumnResizing] = useState(false)
  const colStartX = useRef(0)
  const colStartWidth = useRef(0)

  const anyPanelOpen = canvasOpen || assignmentOpen

  const handleColumnResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    colStartX.current = e.clientX
    colStartWidth.current = rightColumnWidth
    setIsColumnResizing(true)
  }, [rightColumnWidth])

  useEffect(() => {
    if (!isColumnResizing) return

    const prevCursor = document.body.style.cursor
    const prevSelect = document.body.style.userSelect
    document.body.style.cursor = "ew-resize"
    document.body.style.userSelect = "none"

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - colStartX.current
      setRightColumnWidth(Math.min(MAX_COLUMN_WIDTH, Math.max(MIN_COLUMN_WIDTH, colStartWidth.current - delta)))
    }

    const handleMouseUp = () => {
      setIsColumnResizing(false)
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
  }, [isColumnResizing])

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

      {/* Right panel column — shared resize */}
      <div
        className={cn(
          "relative flex flex-shrink-0",
          !isColumnResizing && "transition-[width] duration-300 ease-in-out",
        )}
        style={{ width: anyPanelOpen ? rightColumnWidth : 0 }}
      >
        {/* Left-edge resize handle */}
        {anyPanelOpen && (
          <div
            onMouseDown={handleColumnResizeStart}
            aria-hidden
            className="group absolute left-0 top-0 z-10 h-full w-3 cursor-ew-resize flex items-center justify-start pl-px"
          >
            <div
              className={cn(
                "h-10 w-[3px] rounded-full transition-all duration-150",
                isColumnResizing
                  ? "bg-primary/50 opacity-100"
                  : "bg-foreground/15 opacity-0 group-hover:opacity-100",
              )}
            />
          </div>
        )}

        <div
          className="grid flex-1 h-full transition-[grid-template-rows] duration-300 ease-in-out"
          style={{
            gridTemplateRows: `${canvasOpen ? "1fr" : "0fr"} ${assignmentOpen ? "1fr" : "0fr"}`,
          }}
        >
          <div className="flex flex-col min-h-0 overflow-hidden">
            <CanvasPane
              onClose={() => setCanvasOpen(false)}
              chatCollapsed={chatCollapsed}
            />
          </div>
          <div className="flex flex-col min-h-0 overflow-hidden">
            <AssignmentPane
              onClose={() => setAssignmentOpen(false)}
              showCloseButton={canvasOpen}
            />
          </div>
        </div>
      </div>

      {/* Panel dropdown — floats over top-right corner */}
      <div className="absolute right-3 top-2 z-50 flex h-14 items-center">
        {canvasOpen && (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Close canvas"
            title="Close canvas"
            onClick={() => setCanvasOpen(false)}
            className="hover:bg-black/10"
          >
            <X className="size-3.5" />
          </Button>
        )}
        {assignmentOpen && !canvasOpen && (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Close assignment"
            title="Close assignment"
            onClick={() => setAssignmentOpen(false)}
            className="hover:bg-black/10"
          >
            <X className="size-3.5" />
          </Button>
        )}
        {anyPanelOpen && <div className="mx-1 h-4 w-px bg-border" />}
        <DropdownMenu>
          <DropdownMenuTrigger className="group/trigger flex items-center gap-1 rounded-md px-2 py-1.5 text-foreground transition-colors hover:bg-black/10 outline-none">
            <PanelRight className="size-4" />
            <ChevronDown className="size-3 rotate-180 transition-transform group-data-[state=open]/trigger:rotate-0" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={2} className="min-w-[170px]">
            <DropdownMenuCheckboxItem
              checked={canvasOpen}
              onCheckedChange={setCanvasOpen}
            >
              <PanelRight className="size-3.5" />
              Canvas
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={assignmentOpen}
              onCheckedChange={setAssignmentOpen}
            >
              <ClipboardList className="size-3.5" />
              Assignment
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
