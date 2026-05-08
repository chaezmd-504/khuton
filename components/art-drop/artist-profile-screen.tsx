"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowLeft, MoreHorizontal, Grid3x3, Play } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSubscribeStore } from "@/store/subscribe-store"

interface ArtistWork {
  id: string
  thumbnail: string
  isVideo: boolean
  views?: number
}

interface Artist {
  id: string
  artistId: string
  artistName: string
  profileImage: string
  bio: string
  followers: number
  following: number
  totalDrops: number
  works: ArtistWork[]
  isSubscribed: boolean
}

const mockArtistData: Record<string, Artist> = {
  "@minjun_art": {
    id: "1",
    artistId: "@minjun_art",
    artistName: "민준",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    bio: "수채화로 일상의 순간을 담는 아티스트입니다. 봄의 잔상 시리즈 연재 중",
    followers: 12400,
    following: 234,
    totalDrops: 892000,
    works: [
      { id: "1", thumbnail: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300&h=300&fit=crop", isVideo: true, views: 15000 },
      { id: "2", thumbnail: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=300&h=300&fit=crop", isVideo: true, views: 8200 },
      { id: "3", thumbnail: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=300&h=300&fit=crop", isVideo: false },
      { id: "4", thumbnail: "https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=300&h=300&fit=crop", isVideo: true, views: 5600 },
      { id: "5", thumbnail: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=300&h=300&fit=crop", isVideo: false },
      { id: "6", thumbnail: "https://images.unsplash.com/photo-1579541814924-49fef17c5be5?w=300&h=300&fit=crop", isVideo: true, views: 12300 },
    ],
    isSubscribed: true,
  },
  "@soyeon.draws": {
    id: "2",
    artistId: "@soyeon.draws",
    artistName: "소연",
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    bio: "도시의 소음을 그립니다. 추상화가 | 일러스트레이터",
    followers: 8900,
    following: 156,
    totalDrops: 456000,
    works: [
      { id: "1", thumbnail: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=300&h=300&fit=crop", isVideo: true, views: 9800 },
      { id: "2", thumbnail: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=300&h=300&fit=crop", isVideo: false },
      { id: "3", thumbnail: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=300&h=300&fit=crop", isVideo: true, views: 4500 },
    ],
    isSubscribed: true,
  },
  "@leehyun_studio": {
    id: "3",
    artistId: "@leehyun_studio",
    artistName: "이현",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    bio: "흙으로 빚는 새벽의 고요함. 도예가 | 조각가",
    followers: 15200,
    following: 89,
    totalDrops: 1230000,
    works: [
      { id: "1", thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop", isVideo: true, views: 22000 },
      { id: "2", thumbnail: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=300&h=300&fit=crop", isVideo: false },
      { id: "3", thumbnail: "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=300&h=300&fit=crop", isVideo: true, views: 18000 },
      { id: "4", thumbnail: "https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?w=300&h=300&fit=crop", isVideo: false },
    ],
    isSubscribed: false,
  },
  "@park.illust": {
    id: "4",
    artistId: "@park.illust",
    artistName: "박일러스트",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    bio: "기억의 색채를 디지털로 재해석합니다. 디지털 아트 | NFT",
    followers: 23100,
    following: 312,
    totalDrops: 2890000,
    works: [
      { id: "1", thumbnail: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=300&fit=crop", isVideo: true, views: 45000 },
      { id: "2", thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop", isVideo: true, views: 32000 },
      { id: "3", thumbnail: "https://images.unsplash.com/photo-1549887552-cb1071d3e5ca?w=300&h=300&fit=crop", isVideo: false },
      { id: "4", thumbnail: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=300&h=300&fit=crop", isVideo: true, views: 28000 },
      { id: "5", thumbnail: "https://images.unsplash.com/photo-1573096108468-702f6014ef28?w=300&h=300&fit=crop", isVideo: false },
    ],
    isSubscribed: true,
  },
  "@jiwon.ceramic": {
    id: "5",
    artistId: "@jiwon.ceramic",
    artistName: "지원 세라믹",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
    bio: "손끝으로 만드는 따뜻한 그릇. 도예 작가",
    followers: 6700,
    following: 178,
    totalDrops: 345000,
    works: [
      { id: "1", thumbnail: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=300&h=300&fit=crop", isVideo: true, views: 7800 },
      { id: "2", thumbnail: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=300&h=300&fit=crop", isVideo: false },
    ],
    isSubscribed: true,
  },
}

interface ArtistProfileScreenProps {
  artistId: string
  onBack: () => void
  onOpenDM: (artistId: string) => void
}

export function ArtistProfileScreen({ artistId, onBack, onOpenDM }: ArtistProfileScreenProps) {
  const artist = mockArtistData[artistId]
  const { toggleSubscribe, isSubscribed } = useSubscribeStore()
  const subscribed = isSubscribed(artistId)
  const [activeTab, setActiveTab] = useState<"grid" | "reels">("grid")

  if (!artist) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">아티스트를 찾을 수 없습니다</p>
      </div>
    )
  }

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
          <h1 className="text-lg font-bold text-foreground">{artist.artistId}</h1>
          <button className="p-2 -mr-2">
            <MoreHorizontal className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </header>

      <main className="max-w-[375px] mx-auto">
        {/* Profile info */}
        <div className="p-4">
          <div className="flex items-center gap-4">
            {/* Profile image */}
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-muted ring-2 ring-primary/30">
              <Image
                src={artist.profileImage}
                alt={artist.artistName}
                fill
                className="object-cover"
              />
            </div>

            {/* Stats */}
            <div className="flex-1 flex justify-around">
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{artist.works.length}</p>
                <p className="text-xs text-muted-foreground">작품</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{formatNumber(artist.followers)}</p>
                <p className="text-xs text-muted-foreground">구독자</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-secondary">{formatNumber(artist.totalDrops)}</p>
                <p className="text-xs text-muted-foreground">누적 Drop</p>
              </div>
            </div>
          </div>

          {/* Name and bio */}
          <div className="mt-4">
            <p className="font-bold text-foreground">{artist.artistName}</p>
            <p className="text-sm text-muted-foreground mt-1">{artist.bio}</p>
          </div>

          {/* Action buttons */}
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
        <div className="grid grid-cols-3 gap-0.5">
          {artist.works.map((work) => (
            <button
              key={work.id}
              className="relative aspect-square bg-muted"
            >
              <Image
                src={work.thumbnail}
                alt="작품"
                fill
                className="object-cover"
              />
              {work.isVideo && (
                <div className="absolute top-2 right-2">
                  <Play className="w-4 h-4 text-white drop-shadow-lg" fill="white" />
                </div>
              )}
              {work.views && (
                <div className="absolute bottom-2 left-2 flex items-center gap-1">
                  <Play className="w-3 h-3 text-white" fill="white" />
                  <span className="text-xs text-white font-medium drop-shadow-lg">
                    {formatNumber(work.views)}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
