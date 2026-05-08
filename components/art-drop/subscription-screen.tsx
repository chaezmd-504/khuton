"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { ARTISTS } from "@/lib/mock-data"
import { useSubscribeStore } from "@/store/subscribe-store"

const LAST_UPLOAD_TIMES = [
  "방금 전 업로드",
  "1시간 전 업로드",
  "5시간 전 업로드",
  "어제 업로드",
  "3일 전 업로드",
  "1주 전 업로드",
]

interface SubscriptionScreenProps {
  onArtistClick?: (artistId: string) => void
}

export function SubscriptionScreen({ onArtistClick }: SubscriptionScreenProps) {
  const { toggleSubscribe, isSubscribed, subscribedIds } = useSubscribeStore()

  const subscribedArtists = ARTISTS.filter((a) => subscribedIds.has(a.handle))

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="max-w-[375px] mx-auto h-14 px-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-foreground">구독 중인 아티스트</h1>
          <span className="text-sm text-muted-foreground">{subscribedArtists.length}명</span>
        </div>
      </header>

      <main className="max-w-[375px] mx-auto">
        <div className="divide-y divide-border">
          {ARTISTS.map((artist, idx) => (
            <div key={artist.id} className="flex items-center gap-3 p-4">
              {/* Profile image */}
              <button
                onClick={() => onArtistClick?.(artist.handle)}
                className="relative w-14 h-14 rounded-full overflow-hidden bg-muted flex-shrink-0 ring-2 ring-primary/20"
              >
                <Image
                  src={artist.avatarUrl}
                  alt={artist.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </button>

              {/* Artist info */}
              <button
                onClick={() => onArtistClick?.(artist.handle)}
                className="flex-1 min-w-0 text-left"
              >
                <p className="font-semibold text-foreground">{artist.name}</p>
                <p className="text-sm text-muted-foreground">{artist.handle}</p>
                <p className="text-xs text-primary mt-0.5">{LAST_UPLOAD_TIMES[idx % LAST_UPLOAD_TIMES.length]}</p>
              </button>

              {/* Subscribe button */}
              <button
                onClick={() => toggleSubscribe(artist.handle)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold transition-all border",
                  isSubscribed(artist.handle)
                    ? "border-primary text-primary bg-transparent"
                    : "border-primary bg-primary text-primary-foreground"
                )}
              >
                {isSubscribed(artist.handle) ? "구독중" : "구독"}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
