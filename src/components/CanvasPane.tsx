import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  ChevronUp,
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
    <button className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
      {children}
    </button>
  )
}

function Divider() {
  return <div className="mx-0.5 h-4 w-px bg-border" />
}

export function CanvasPane({ onClose }: CanvasPaneProps) {
  return (
    <div className="flex w-[440px] flex-shrink-0 flex-col border-l border-border bg-background">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="text-sm font-medium">Canvas</span>
        <button
          onClick={onClose}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

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
        <button className="flex items-center gap-1 rounded px-1.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
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

      <div className="relative flex-1 overflow-hidden">
        <button className="absolute right-3 top-2 text-muted-foreground transition-colors hover:text-foreground">
          <ChevronUp className="h-4 w-4" />
        </button>
        <div className="h-full overflow-y-auto p-4 pr-8">
          <textarea
            defaultValue="random user notes"
            className="h-full w-full resize-none bg-transparent text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
            placeholder="Start writing your notes..."
          />
        </div>
      </div>

      <div className="border-t border-border p-3">
        <button className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-accent">
          <Download className="h-3.5 w-3.5" />
          Export
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}
