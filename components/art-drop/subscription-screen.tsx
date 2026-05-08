"use client"

import Image from "next/image"
import { Users } from "lucide-react"
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
        {subscribedArtists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground">구독하는 아티스트가 없어요!</p>
            <p className="text-sm text-muted-foreground mt-1">피드나 아티스트 페이지에서 구독해보세요</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {subscribedArtists.map((artist, idx) => (
              <div key={artist.id} className="flex items-center gap-3 p-4">
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
                <button
                  onClick={() => onArtistClick?.(artist.handle)}
                  className="flex-1 min-w-0 text-left"
                >
                  <p className="font-semibold text-foreground">{artist.name}</p>
                  <p className="text-sm text-muted-foreground">{artist.handle}</p>
                  <p className="text-xs text-primary mt-0.5">{LAST_UPLOAD_TIMES[idx % LAST_UPLOAD_TIMES.length]}</p>
                </button>
                <button
                  onClick={() => toggleSubscribe(artist.handle)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all border border-primary text-primary bg-transparent"
                >
                  구독중
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
