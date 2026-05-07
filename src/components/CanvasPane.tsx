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
  chatCollapsed?: boolean
}

function ToolbarBtn({ children, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button variant="ghost" size="icon-xs" className="text-muted-foreground" {...props}>
      {children}
    </Button>
  )
}

function Divider() {
  return <div className="mx-1 h-3.5 w-px bg-border" />
}

export function CanvasPane({ chatCollapsed }: CanvasPaneProps) {
  return (
    <div className="flex flex-1 flex-col rounded-l-2xl bg-background border border-border my-2 overflow-hidden min-h-0">
      <div className={cn("flex h-14 flex-shrink-0 items-center px-5", chatCollapsed && "pl-16")}>
        <span className="text-sm font-medium text-foreground">Canvas</span>
      </div>

      <div className="flex flex-shrink-0 flex-wrap items-center gap-0.5 px-3 pt-1.5">
        <ToolbarBtn aria-label="Undo"><RotateCcw className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn aria-label="Redo"><RotateCw className="h-3 w-3" /></ToolbarBtn>
        <Divider />
        <ToolbarBtn aria-label="Bold"><Bold className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn aria-label="Italic"><Italic className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn aria-label="Underline"><Underline className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn aria-label="Strikethrough"><Strikethrough className="h-3 w-3" /></ToolbarBtn>
        <Divider />
        <ToolbarBtn aria-label="Highlight"><Highlighter className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn aria-label="Text color"><Palette className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn aria-label="Font style"><Type className="h-3 w-3" /></ToolbarBtn>
        <Divider />
        <Button variant="ghost" size="xs" className="text-muted-foreground">
          Paragraph <ChevronDown className="h-3 w-3" />
        </Button>
        <Divider />
        <ToolbarBtn aria-label="Bullet list"><List className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn aria-label="Numbered list"><ListOrdered className="h-3 w-3" /></ToolbarBtn>
        <Divider />
        <ToolbarBtn aria-label="Align left"><AlignLeft className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn aria-label="Align center"><AlignCenter className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn aria-label="Align right"><AlignRight className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn aria-label="Justify"><AlignJustify className="h-3 w-3" /></ToolbarBtn>
        <Divider />
        <ToolbarBtn aria-label="Code block"><Code2 className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn aria-label="Horizontal rule"><Minus className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn aria-label="Insert table"><Table2 className="h-3 w-3" /></ToolbarBtn>
      </div>

      <div className="flex flex-shrink-0 items-center gap-0.5 px-3 pb-1.5">
        <ToolbarBtn aria-label="Insert image"><Image className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn aria-label="Insert video"><Video className="h-3 w-3" /></ToolbarBtn>
        <Divider />
        <ToolbarBtn aria-label="Insert link"><Link className="h-3 w-3" /></ToolbarBtn>
        <Divider />
        <ToolbarBtn aria-label="Insert emoji"><Smile className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn aria-label="Insert hashtag"><Hash className="h-3 w-3" /></ToolbarBtn>
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
