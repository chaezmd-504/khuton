"use client"

import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import { useCoinStore } from "@/store/coin-store"
import { REELS } from "@/lib/mock-data"

interface CertificatesScreenProps {
  onBack: () => void
}

export function CertificatesScreen({ onBack }: CertificatesScreenProps) {
  const { droppedReels } = useCoinStore()

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
          <h1 className="text-lg font-bold text-foreground">디지털 작품 인증서</h1>
        </div>
      </header>

      <main className="max-w-[375px] mx-auto px-4 py-4 space-y-4">
        {droppedReels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-4xl mb-3">💜</span>
            <p className="text-muted-foreground font-medium">아직 후원한 작품이 없어요</p>
            <p className="text-sm text-muted-foreground mt-1">피드에서 Drop 버튼으로 작품을 후원해보세요</p>
          </div>
        ) : (
          [...droppedReels].reverse().map((dropped, idx) => {
            const reel = REELS.find((r) => r.id === dropped.reelId)
            if (!reel) return null

            return (
              <div
                key={idx}
                className="relative overflow-hidden rounded-2xl p-[1px]"
                style={{ background: "linear-gradient(135deg, #7C3AED, #D4AF37)" }}
              >
                <div className="relative rounded-2xl bg-card p-4 overflow-hidden">
                  {/* Decorative seal */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 opacity-10">
                    <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full text-primary">
                      <circle cx="50" cy="50" r="45" />
                      <path
                        d="M50 15 L55 35 L75 35 L60 48 L65 68 L50 55 L35 68 L40 48 L25 35 L45 35 Z"
                        fill="currentColor"
                        className="text-card"
                      />
                    </svg>
                  </div>

                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={reel.thumbnailUrl}
                        alt={reel.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                        unoptimized
                      />
                    </div>

                    {/* Certificate info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground line-clamp-1">{reel.title}</p>
                      <p className="text-sm text-muted-foreground">{reel.artist.name}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground">후원 금액</p>
                          <p className="text-sm font-semibold text-secondary">{dropped.amount.toLocaleString()} C</p>
                        </div>
                        <div className="w-px h-8 bg-border" />
                        <div>
                          <p className="text-xs text-muted-foreground">후원 날짜</p>
                          <p className="text-sm font-medium text-foreground">{dropped.date}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Certificate number */}
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/50">
                      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-primary">
                        <path
                          d="M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path d="M8 15v6l4-2 4 2v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-xs font-mono text-muted-foreground">{dropped.certNumber}</span>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-border via-border to-transparent" />
                  </div>
                </div>
              </div>
            )
          })
        )}
      </main>
    </div>
  )
}
