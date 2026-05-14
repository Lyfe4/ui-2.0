import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import {
  Award,
  Calendar,
  FileText,
  MessageSquare,
  Star,
  UploadCloud,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AssignmentPaneProps {
  onClose: () => void
  showCloseButton?: boolean
}

type Tab = "assignment" | "submit" | "feedback"

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "assignment", label: "Assignment", icon: FileText },
  { id: "submit",     label: "Submit",     icon: UploadCloud },
  { id: "feedback",   label: "Feedback",   icon: MessageSquare },
]

const mockAssignment = {
  title: "Chapter 3 Review",
  dueDate: "May 10, 2026",
  points: 100,
  description:
    "Demonstrate your understanding of the immune system by completing the written response below. Your answer should show clear comprehension of both the innate and adaptive immune responses.",
  content:
    "Write a 500–700 word essay that explains how the immune system identifies and responds to a novel pathogen it has never encountered before. Your response must cover:\n\n1. The role of pattern recognition receptors (PRRs) in the innate immune response.\n2. How antigen presentation bridges innate and adaptive immunity.\n3. The mechanism by which B and T cells mount a specific response.\n4. Why immunological memory leads to faster responses on re-exposure.\n\nUse precise terminology and, where relevant, cite specific cell types or molecules discussed in the lesson.",
}

const mockFeedback = {
  score: 87,
  maxPoints: 100,
  grade: "B+",
  released: true,
  comments:
    "Strong grasp of innate immunity and the role of PRRs — your description of TLR signalling was particularly clear. The section on antigen presentation was accurate but could go deeper on MHC class II vs class I distinctions. Your B and T cell coverage was solid, though the explanation of somatic hypermutation was slightly imprecise. Memory cell formation was well described. Overall a commendable effort; tightening the mechanistic detail in section 2 would push this into the A range.",
}

interface UploadedFile {
  name: string
  size: number
  id: string
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function AssignmentPane({ onClose, showCloseButton }: AssignmentPaneProps) {
  const [activeTab, setActiveTab] = useState<Tab>("assignment")
  const [dragging, setDragging] = useState(false)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const tabButtonRefs = useRef<(HTMLButtonElement | null)[]>([])
  const tabContainerRef = useRef<HTMLDivElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const activeTabRef = useRef(activeTab)
  activeTabRef.current = activeTab

  const measureIndicator = useCallback(() => {
    const idx = tabs.findIndex(t => t.id === activeTabRef.current)
    const btn = tabButtonRefs.current[idx]
    if (btn) setIndicatorStyle({ left: btn.offsetLeft, width: btn.offsetWidth })
  }, [])

  useLayoutEffect(() => { measureIndicator() }, [activeTab, measureIndicator])

  useEffect(() => {
    if (!tabContainerRef.current) return
    const observer = new ResizeObserver(measureIndicator)
    observer.observe(tabContainerRef.current)
    return () => observer.disconnect()
  }, [measureIndicator])

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return
    setFiles(prev => [
      ...prev,
      ...Array.from(incoming).map(f => ({ name: f.name, size: f.size, id: crypto.randomUUID() })),
    ])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }

  return (
    <div className="flex flex-1 flex-col rounded-l-2xl bg-background border border-border my-2 overflow-hidden min-h-0">
      {/* Header */}
      <div className="flex h-14 flex-shrink-0 items-center gap-2 px-5">
        <span className="flex-1 truncate text-sm font-medium text-foreground">
          {mockAssignment.title}
        </span>
        {showCloseButton && (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Close assignment"
            onClick={onClose}
            className="shrink-0"
          >
            <X className="size-3.5" />
          </Button>
        )}
      </div>

      {/* Pill tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as Tab)}
        className="flex flex-1 flex-col overflow-hidden min-h-0"
      >
        <div className="flex-shrink-0 px-4 pb-3">
          <TabsList
            ref={tabContainerRef as React.RefObject<HTMLDivElement>}
            className="relative flex h-auto rounded-xl bg-muted p-1 gap-1"
          >
            <div
              aria-hidden
              className="absolute rounded-lg bg-background shadow-sm transition-all duration-200 ease-in-out"
              style={{ left: indicatorStyle.left, width: indicatorStyle.width, top: 4, bottom: 4 }}
            />
            {tabs.map(({ id, label, icon: Icon }, index) => (
              <TabsTrigger
                key={id}
                value={id}
                ref={(el) => { tabButtonRefs.current[index] = el as HTMLButtonElement | null }}
                className={cn(
                  "relative flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition-colors duration-150",
                  activeTab === id
                    ? "text-foreground"
                    : "text-muted-foreground hover:bg-surface-hover hover:text-foreground",
                )}
              >
                <Icon className="h-3 w-3 shrink-0" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Assignment tab */}
        <TabsContent value="assignment" className="flex flex-1 flex-col overflow-hidden min-h-0">
          <ScrollArea className="flex-1 min-h-0" viewportProps={{ tabIndex: 0 }}>
            <div className="flex flex-col gap-4 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="accent">{mockAssignment.points} pts</Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" aria-hidden />
                  Due {mockAssignment.dueDate}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Overview</span>
                <p className="text-sm leading-relaxed text-foreground">{mockAssignment.description}</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Instructions</span>
                <div className="rounded-xl bg-muted px-4 py-3">
                  {mockAssignment.content.split("\n\n").map((block, i) => (
                    <p key={i} className={cn("text-sm leading-relaxed text-foreground", i > 0 && "mt-3")}>
                      {block}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Submit tab */}
        <TabsContent value="submit" className="flex flex-1 flex-col overflow-hidden min-h-0">
          <ScrollArea className="flex-1 min-h-0" viewportProps={{ tabIndex: 0 }}>
            <div className="flex flex-col gap-4 p-4">
              <div
                role="button"
                tabIndex={0}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={() => setDragging(false)}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click() }}
                aria-label="Upload files — drag and drop or click to browse"
                className={cn(
                  "flex cursor-pointer flex-col items-center gap-2.5 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors duration-150",
                  dragging
                    ? "border-primary/50 bg-primary/5"
                    : "border-border hover:border-border/80 hover:bg-muted/50",
                )}
              >
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-150",
                  dragging ? "bg-primary/10" : "bg-muted",
                )}>
                  <UploadCloud className={cn("h-5 w-5", dragging ? "text-primary" : "text-muted-foreground")} aria-hidden />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground">
                    {dragging ? "Drop to upload" : "Drag & drop files here"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    or <span className="text-primary">browse your device</span>
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground">PDF, DOCX, TXT up to 25 MB</span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                aria-hidden
                onChange={e => addFiles(e.target.files)}
              />

              {files.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Uploaded ({files.length})
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {files.map(file => (
                      <div
                        key={file.id}
                        className="flex items-center gap-2.5 rounded-xl border border-border bg-muted/40 px-3 py-2.5"
                      >
                        <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
                        <div className="flex min-w-0 flex-1 flex-col">
                          <span className="truncate text-xs font-medium text-foreground">{file.name}</span>
                          <span className="text-[11px] text-muted-foreground">{formatBytes(file.size)}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => setFiles(prev => prev.filter(f => f.id !== file.id))}
                          aria-label={`Remove ${file.name}`}
                          className="shrink-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button disabled={files.length === 0} className="w-full" size="sm">
                Submit Assignment
              </Button>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Feedback tab */}
        <TabsContent value="feedback" className="flex flex-1 flex-col overflow-hidden min-h-0">
          <ScrollArea className="flex-1 min-h-0" viewportProps={{ tabIndex: 0 }}>
            <div className="flex flex-col gap-4 p-4">
              {mockFeedback.released ? (
                <>
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Star className="h-4 w-4 text-primary" aria-hidden />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <span className="text-xs text-muted-foreground">Score</span>
                      <span className="text-sm font-semibold text-foreground">
                        {mockFeedback.score} / {mockFeedback.maxPoints}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-muted-foreground">Grade</span>
                      <div className="flex items-center gap-1.5">
                        <Award className="h-3.5 w-3.5 text-primary" aria-hidden />
                        <span className="text-sm font-semibold text-foreground">{mockFeedback.grade}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Instructor Feedback
                    </span>
                    <div className="rounded-xl bg-muted px-4 py-3">
                      <p className="text-sm leading-relaxed text-foreground">{mockFeedback.comments}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" aria-hidden />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-foreground">Feedback not yet released</span>
                    <span className="text-xs text-muted-foreground">
                      Your instructor will release grades once marking is complete.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
