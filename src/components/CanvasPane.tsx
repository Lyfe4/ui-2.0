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
 
interface CanvasPaneProps {
  onClose: () => void
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
 
export function CanvasPane({ onClose }: CanvasPaneProps) {
  return (
    <div className="flex w-[420px] flex-shrink-0 flex-col border-l border-border bg-muted">
      <div className="flex items-center justify-between px-5 py-4">
        <span className="text-sm font-medium text-foreground">Canvas</span>
        <button onClick={onClose} className="text-muted-foreground transition-colors hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
 
      <div className="mx-3 mb-3 flex flex-1 flex-col overflow-hidden rounded-lg border border-border bg-background">
        <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-2 py-1.5">
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
        </div>
 
        <div className="flex items-center gap-0.5 border-b border-border px-2 py-1.5">
          <ToolbarBtn><Image className="h-3 w-3" /></ToolbarBtn>
          <ToolbarBtn><Video className="h-3 w-3" /></ToolbarBtn>
          <Divider />
          <ToolbarBtn><Link className="h-3 w-3" /></ToolbarBtn>
          <Divider />
          <ToolbarBtn><Smile className="h-3 w-3" /></ToolbarBtn>
          <ToolbarBtn><Hash className="h-3 w-3" /></ToolbarBtn>
        </div>
 
        <div className="flex-1 overflow-y-auto p-4">
          <textarea
            defaultValue="random user notes"
            className="h-full min-h-48 w-full resize-none bg-transparent text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
            placeholder="Start writing your notes..."
          />
        </div>
      </div>
 
      <div className="px-3 pb-3">
        <button className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted">
          <Download className="h-3.5 w-3.5" />
          Export
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}
