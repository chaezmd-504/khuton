"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowLeft, MoreHorizontal, Grid3x3, Play } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSubscribeStore } from "@/store/subscribe-store"
import { ARTISTS, REELS } from "@/lib/mock-data"

interface ArtistProfileScreenProps {
  artistId: string
  onBack: () => void
  onOpenDM: (artistId: string) => void
}

export function ArtistProfileScreen({ artistId, onBack, onOpenDM }: ArtistProfileScreenProps) {
  const artistData = ARTISTS.find((a) => a.handle === artistId)
  const { toggleSubscribe, isSubscribed } = useSubscribeStore()
  const subscribed = isSubscribed(artistId)
  const [activeTab, setActiveTab] = useState<"grid" | "reels">("grid")

  if (!artistData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">아티스트를 찾을 수 없습니다</p>
      </div>
    )
  }

  const artistReels = REELS.filter((r) => r.artist.handle === artistId)
  const totalDrops = artistReels.reduce((sum, r) => sum + r.totalFunded, 0)
  const following = Math.floor(artistData.followers / 20)

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="max-w-[375px] mx-auto h-14 px-4 flex items-center justify-between">
          <button onClick={onBack} className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">{artistData.handle}</h1>
          <button className="p-2 -mr-2">
            <MoreHorizontal className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </header>

      <main className="max-w-[375px] mx-auto">
        {/* Profile info */}
        <div className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-muted ring-2 ring-primary/30">
              <Image
                src={artistData.avatarUrl}
                alt={artistData.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="flex-1 flex justify-around">
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{artistReels.length}</p>
                <p className="text-xs text-muted-foreground">작품</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{formatNumber(artistData.followers)}</p>
                <p className="text-xs text-muted-foreground">구독자</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-secondary">{formatNumber(totalDrops)}</p>
                <p className="text-xs text-muted-foreground">누적 Drop</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="font-bold text-foreground">{artistData.name}</p>
            <p className="text-sm text-muted-foreground mt-1">{artistData.bio}</p>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => toggleSubscribe(artistId)}
              className={cn(
                "flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all border",
                subscribed
                  ? "border-primary text-primary bg-transparent"
                  : "bg-primary text-primary-foreground border-primary"
              )}
            >
              {subscribed ? "구독중" : "구독하기"}
            </button>
            <button
              onClick={() => onOpenDM(artistId)}
              className="flex-1 py-2.5 rounded-lg font-semibold text-sm bg-card border border-border text-foreground"
            >
              메시지
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab("grid")}
            className={cn(
              "flex-1 py-3 flex items-center justify-center transition-colors",
              activeTab === "grid" ? "border-b-2 border-foreground" : "text-muted-foreground"
            )}
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveTab("reels")}
            className={cn(
              "flex-1 py-3 flex items-center justify-center transition-colors",
              activeTab === "reels" ? "border-b-2 border-foreground" : "text-muted-foreground"
            )}
          >
            <Play className="w-5 h-5" />
          </button>
        </div>

        {/* Works grid */}
        {artistReels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-muted-foreground">등록된 작품이 없어요</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-0.5">
            {artistReels.map((reel) => (
              <button key={reel.id} className="relative aspect-square bg-muted">
                <Image
                  src={reel.thumbnailUrl}
                  alt={reel.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute top-2 right-2">
                  <Play className="w-4 h-4 text-white drop-shadow-lg" fill="white" />
                </div>
                <div className="absolute bottom-2 left-2 flex items-center gap-1">
                  <Play className="w-3 h-3 text-white" fill="white" />
                  <span className="text-xs text-white font-medium drop-shadow-lg">
                    {formatNumber(reel.totalFunded)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
