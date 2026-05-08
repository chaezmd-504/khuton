"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface Artist {
  id: string
  artistId: string
  artistName: string
  profileImage: string
  thumbnail: string
  lastUpload: string
  isSubscribed: boolean
}

const mockArtists: Artist[] = [
  {
    id: "1",
    artistId: "@minjun_art",
    artistName: "민준",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    thumbnail: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=100&h=100&fit=crop",
    lastUpload: "방금 전 업로드",
    isSubscribed: true,
  },
  {
    id: "2",
    artistId: "@soyeon.draws",
    artistName: "소연",
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    thumbnail: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=100&h=100&fit=crop",
    lastUpload: "1시간 전 업로드",
    isSubscribed: true,
  },
  {
    id: "3",
    artistId: "@leehyun_studio",
    artistName: "이현 스튜디오",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop",
    lastUpload: "5시간 전 업로드",
    isSubscribed: true,
  },
  {
    id: "4",
    artistId: "@park.illust",
    artistName: "박일러스트",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    thumbnail: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=100&h=100&fit=crop",
    lastUpload: "어제 업로드",
    isSubscribed: true,
  },
  {
    id: "5",
    artistId: "@jiwon.ceramic",
    artistName: "지원 세라믹",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    thumbnail: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=100&h=100&fit=crop",
    lastUpload: "3일 전 업로드",
    isSubscribed: true,
  },
]

interface SubscriptionScreenProps {
  onArtistClick?: (artistId: string) => void
}

export function SubscriptionScreen({ onArtistClick }: SubscriptionScreenProps) {
  const [artists, setArtists] = useState(mockArtists)

  const toggleSubscription = (id: string) => {
    setArtists((prev) =>
      prev.map((artist) =>
        artist.id === id ? { ...artist, isSubscribed: !artist.isSubscribed } : artist
      )
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="max-w-[375px] mx-auto h-14 px-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-foreground">구독 중인 아티스트</h1>
          <button className="text-sm text-primary font-medium">편집</button>
        </div>
      </header>

      {/* Artist list */}
      <main className="max-w-[375px] mx-auto">
        <div className="divide-y divide-border">
          {artists.map((artist) => (
            <div key={artist.id} className="flex items-center gap-3 p-4">
              {/* Profile image - clickable */}
              <button
                onClick={() => onArtistClick?.(artist.artistId)}
                className="relative w-14 h-14 rounded-full overflow-hidden bg-muted flex-shrink-0 ring-2 ring-primary/20"
              >
                <Image
                  src={artist.profileImage}
                  alt={artist.artistName}
                  fill
                  className="object-cover"
                />
              </button>

              {/* Artist info - clickable */}
              <button
                onClick={() => onArtistClick?.(artist.artistId)}
                className="flex-1 min-w-0 text-left"
              >
                <p className="font-semibold text-foreground">{artist.artistName}</p>
                <p className="text-sm text-muted-foreground">{artist.artistId}</p>
                <p className="text-xs text-primary mt-0.5">{artist.lastUpload}</p>
              </button>

              {/* Subscribe button or thumbnail */}
              <div className="flex items-center gap-2">
                <div className="relative w-10 h-14 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={artist.thumbnail}
                    alt="최근 작품"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  onClick={() => toggleSubscription(artist.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                    artist.isSubscribed
                      ? "bg-muted text-muted-foreground border border-border"
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  {artist.isSubscribed ? "구독중" : "구독"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {artists.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-8 h-8 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
            </div>
            <p className="text-muted-foreground">
              아직 구독한 아티스트가 없습니다
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              피드에서 마음에 드는 아티스트를 구독해보세요
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
