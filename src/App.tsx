import { useState } from "react"
import { CanvasPane } from "@/components/CanvasPane"
import { ChatPane } from "@/components/ChatPane"
import { ContentPane } from "@/components/ContentPane"

export default function App() {
  const [canvasOpen, setCanvasOpen] = useState(false)

  return (
    <div className="flex h-screen gap-2 overflow-hidden bg-stone-950 p-2">
      <ChatPane />
      <ContentPane
        canvasOpen={canvasOpen}
        onToggleCanvas={() => setCanvasOpen((o) => !o)}
      />
      {canvasOpen && <CanvasPane onClose={() => setCanvasOpen(false)} />}
    </div>
  )
}
