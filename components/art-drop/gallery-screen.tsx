"use client"

import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import { useCoinStore } from "@/store/coin-store"
import { REELS } from "@/lib/mock-data"

interface GalleryScreenProps {
  onBack: () => void
}

export function GalleryScreen({ onBack }: GalleryScreenProps) {
  const { droppedReels } = useCoinStore()

  // 중복 제거: 같은 릴을 여러 번 drop해도 한 번만 표시, 가장 최근 drop 기준
  const uniqueReelIds = [...new Set(droppedReels.map((d) => d.reelId))]
  const droppedRealReels = uniqueReelIds
    .map((id) => REELS.find((r) => r.id === id))
    .filter(Boolean) as typeof REELS

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="max-w-[375px] mx-auto h-14 px-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="뒤로가기"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-foreground">후원한 작품</h1>
        </div>
      </header>

      <main className="max-w-[375px] mx-auto px-3 py-4">
        {droppedRealReels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-4xl mb-3">💜</span>
            <p className="text-muted-foreground font-medium">아직 후원한 작품이 없어요</p>
            <p className="text-sm text-muted-foreground mt-1">피드에서 Drop 버튼으로 작품을 후원해보세요</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {droppedRealReels.map((reel) => {
              const latest = [...droppedReels].reverse().find((d) => d.reelId === reel.id)
              return (
                <div key={reel.id} className="group">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                    <Image
                      src={reel.thumbnailUrl}
                      alt={reel.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 375px) 50vw, 180px"
                      unoptimized
                    />
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-foreground line-clamp-1">{reel.title}</p>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-xs text-muted-foreground">{reel.artist.name}</p>
                      <p className="text-xs text-secondary font-medium">{latest?.amount.toLocaleString()} C</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
