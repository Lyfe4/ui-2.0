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
    <button className="flex h-6 w-6 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700">
      {children}
    </button>
  )
}

function Divider() {
  return <div className="mx-1 h-3.5 w-px bg-zinc-200" />
}

export function CanvasPane({ onClose }: CanvasPaneProps) {
  return (
    <div className="flex w-[440px] flex-shrink-0 flex-col border-l border-zinc-100 bg-zinc-50">
      <div className="flex items-center justify-between px-5 py-4">
        <span className="text-sm font-medium text-zinc-700">Canvas</span>
        <button onClick={onClose} className="text-zinc-400 transition-colors hover:text-zinc-700">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mx-4 mb-3 rounded-lg border border-zinc-200 bg-white">
        <div className="flex flex-wrap items-center gap-0.5 border-b border-zinc-100 px-2 py-1.5">
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
          <button className="flex items-center gap-1 rounded px-1.5 py-1 text-xs text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700">
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

        <div className="flex items-center gap-0.5 px-2 py-1.5">
          <ToolbarBtn><Image className="h-3 w-3" /></ToolbarBtn>
          <ToolbarBtn><Video className="h-3 w-3" /></ToolbarBtn>
          <Divider />
          <ToolbarBtn><Link className="h-3 w-3" /></ToolbarBtn>
          <Divider />
          <ToolbarBtn><Smile className="h-3 w-3" /></ToolbarBtn>
          <ToolbarBtn><Hash className="h-3 w-3" /></ToolbarBtn>
        </div>

        <div className="h-px bg-zinc-100" />

        <div className="p-4">
          <textarea
            defaultValue="random user notes"
            className="h-52 w-full resize-none bg-transparent text-sm leading-relaxed text-zinc-700 outline-none placeholder:text-zinc-300"
            placeholder="Start writing your notes..."
          />
        </div>
      </div>

      <div className="px-4">
        <button className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-100">
          <Download className="h-3.5 w-3.5" />
          Export
          <ChevronDown className="h-3 w-3 text-zinc-400" />
        </button>
      </div>
    </div>
  )
}
