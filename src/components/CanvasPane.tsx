import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Code2,
  Download,
  Hash,
  Highlighter,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  Minus,
  Palette,
  RotateCcw,
  RotateCw,
  Smile,
  Strikethrough,
  Table2,
  Type,
  Underline,
  Video,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface CanvasPaneProps {
  onClose: () => void
  chatCollapsed?: boolean
}

function ToolbarBtn({ children }: { children: React.ReactNode }) {
  return (
    <Button variant="ghost" size="icon-xs" className="text-muted-foreground hover:text-foreground">
      {children}
    </Button>
  )
}

function Divider() {
  return <div className="mx-1 h-3.5 w-px bg-border" />
}

export function CanvasPane({ onClose, chatCollapsed }: CanvasPaneProps) {
  return (
    <div className="flex flex-1 flex-col rounded-l-2xl bg-background border border-border shadow-[-2px_0_12px_-2px_rgba(0,0,0,0.08)] my-2 overflow-hidden min-h-0">
      <div className={cn("flex h-14 flex-shrink-0 items-center px-5", chatCollapsed && "pl-16")}>
        <span className="text-sm font-medium text-foreground">Canvas</span>
      </div>

      <div className="flex flex-shrink-0 flex-wrap items-center gap-0.5 px-3 pt-1.5">
        <ToolbarBtn><RotateCcw className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn><RotateCw className="h-3 w-3" /></ToolbarBtn>
        <Divider />
        <ToolbarBtn><Bold className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn><Italic className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn><Underline className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn><Strikethrough className="h-3 w-3" /></ToolbarBtn>
        <Divider />
        <ToolbarBtn><Highlighter className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn><Palette className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn><Type className="h-3 w-3" /></ToolbarBtn>
        <Divider />
        <Button variant="ghost" size="xs" className="text-muted-foreground hover:text-foreground">
          Paragraph <ChevronDown className="h-3 w-3" />
        </Button>
        <Divider />
        <ToolbarBtn><List className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn><ListOrdered className="h-3 w-3" /></ToolbarBtn>
        <Divider />
        <ToolbarBtn><AlignLeft className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn><AlignCenter className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn><AlignRight className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn><AlignJustify className="h-3 w-3" /></ToolbarBtn>
        <Divider />
        <ToolbarBtn><Code2 className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn><Minus className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn><Table2 className="h-3 w-3" /></ToolbarBtn>
      </div>

      <div className="flex flex-shrink-0 items-center gap-0.5 px-3 pb-1.5">
        <ToolbarBtn><Image className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn><Video className="h-3 w-3" /></ToolbarBtn>
        <Divider />
        <ToolbarBtn><Link className="h-3 w-3" /></ToolbarBtn>
        <Divider />
        <ToolbarBtn><Smile className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn><Hash className="h-3 w-3" /></ToolbarBtn>
      </div>

      <div className="h-px w-full flex-shrink-0 bg-border" />
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        <Textarea
          defaultValue="random user notes"
          className="h-full min-h-48 resize-none border-0 bg-transparent p-0 text-sm leading-relaxed shadow-none focus-visible:ring-0"
          placeholder="Start writing your notes..."
        />
      </div>

      <div className="flex-shrink-0 px-4 py-3">
        <Button variant="outline" size="sm">
          <Download className="h-3.5 w-3.5" />
          Export
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </div>
    </div>
  )
}
