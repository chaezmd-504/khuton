"use client"

import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { useArchiveStore } from "@/store/archive-store"
import { REELS } from "@/lib/mock-data"

interface SavedWorksScreenProps {
  onBack: () => void
}

export function SavedWorksScreen({ onBack }: SavedWorksScreenProps) {
  const { archivedIds } = useArchiveStore()
  const savedReels = REELS.filter((r) => archivedIds.has(r.id))

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="max-w-[375px] mx-auto h-14 px-4 flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">저장한 작품</h1>
        </div>
      </header>

      <main className="max-w-[375px] mx-auto">
        {savedReels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-muted-foreground">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <rect x="6" y="6" width="12" height="12" rx="1" />
              </svg>
            </div>
            <p className="text-muted-foreground">저장한 작품이 없어요 🖼️</p>
            <p className="text-sm text-muted-foreground mt-1">피드에서 Archive 버튼을 눌러 저장해보세요</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-0.5">
            {savedReels.map((reel) => (
              <button key={reel.id} className="relative aspect-[3/4] bg-muted group">
                <Image
                  src={reel.thumbnailUrl}
                  alt={reel.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-xs text-white font-medium truncate">{reel.artist.name}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
