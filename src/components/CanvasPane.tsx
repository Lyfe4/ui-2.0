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
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface CanvasPaneProps {
  onClose: () => void
  chatCollapsed?: boolean
}
 
function ToolbarBtn({ children }: { children: React.ReactNode }) {
  return (
    <button className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
      {children}
    </button>
  )
}
 
function Divider() {
  return <div className="mx-1 h-3.5 w-px bg-border" />
}
 
export function CanvasPane({ onClose, chatCollapsed }: CanvasPaneProps) {
  return (
    <div className="flex w-full sm:w-[420px] flex-shrink-0 flex-col rounded-l-2xl bg-background border border-black/[0.07] shadow-[-2px_0_12px_-2px_rgba(0,0,0,0.08)] my-2">
      <div className="rounded-tl-2xl bg-muted/40 px-3 pt-2 pb-1.5">
        <div className="flex flex-wrap items-center gap-0.5">
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
          <button className="flex items-center gap-1 rounded px-1.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            Paragraph <ChevronDown className="h-3 w-3" />
          </button>
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
          <button onClick={onClose} className="ml-auto flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <X className="h-3 w-3" />
          </button>
        </div>
        <div className="flex items-center gap-0.5">
          <ToolbarBtn><Image className="h-3 w-3" /></ToolbarBtn>
          <ToolbarBtn><Video className="h-3 w-3" /></ToolbarBtn>
          <Divider />
          <ToolbarBtn><Link className="h-3 w-3" /></ToolbarBtn>
          <Divider />
          <ToolbarBtn><Smile className="h-3 w-3" /></ToolbarBtn>
          <ToolbarBtn><Hash className="h-3 w-3" /></ToolbarBtn>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <textarea
          defaultValue="random user notes"
          className="h-full min-h-48 w-full resize-none bg-transparent text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
          placeholder="Start writing your notes..."
        />
      </div>

      <div className="px-4 py-3">
        <button className="flex items-center gap-2 rounded-lg border border-black/[0.07] px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted">
          <Download className="h-3.5 w-3.5" />
          Export
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}
