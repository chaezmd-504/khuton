"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface VideoCard {
  id: string
  artistId: string
  artistName: string
  title: string
  duration: string
  thumbnail: string
  profileImage: string
}

const mockVideos: VideoCard[] = [
  {
    id: "1",
    artistId: "@minjun_art",
    artistName: "민준",
    title: "봄의 잔상 #3",
    duration: "0:38",
    thumbnail: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=711&fit=crop",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "2",
    artistId: "@soyeon.draws",
    artistName: "소연",
    title: "도시의 소음을 그리다",
    duration: "0:55",
    thumbnail: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400&h=711&fit=crop",
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "3",
    artistId: "@leehyun_studio",
    artistName: "이현",
    title: "점토로 빚는 새벽",
    duration: "0:29",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=711&fit=crop",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "4",
    artistId: "@park.illust",
    artistName: "박일러스트",
    title: "기억의 색채 연구",
    duration: "0:47",
    thumbnail: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=711&fit=crop",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "5",
    artistId: "@choi.wave",
    artistName: "최웨이브",
    title: "파도 드로잉 라이브",
    duration: "1:00",
    thumbnail: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=711&fit=crop",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "6",
    artistId: "@jiwon.ceramic",
    artistName: "지원",
    title: "조각 과정 : 균열",
    duration: "0:33",
    thumbnail: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=711&fit=crop",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
  },
]

interface HomeScreenProps {
  onVideoClick: (videoId: string) => void
}

export function HomeScreen({ onVideoClick }: HomeScreenProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="max-w-[375px] mx-auto h-14 px-4 flex items-center justify-between">
          {isSearchOpen ? (
            <div className="flex-1 flex items-center gap-2 animate-fade-in">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="작가명, 작품명 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 rounded-full bg-muted text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              </div>
              <button
                onClick={() => {
                  setIsSearchOpen(false)
                  setSearchQuery("")
                }}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="검색 닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold text-foreground tracking-tight">Art-Drop</h1>
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="검색"
              >
                <Search className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </header>

      {/* Video Grid */}
      <main className="max-w-[375px] mx-auto px-3 py-4">
        <div className="grid grid-cols-2 gap-3">
          {mockVideos
            .filter(
              (video) =>
                !searchQuery ||
                video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                video.artistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                video.artistId.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((video) => (
              <button
                key={video.id}
                onClick={() => onVideoClick(video.id)}
                className="group relative flex flex-col gap-2 text-left"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-muted">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 375px) 50vw, 180px"
                  />
                  {/* Duration badge */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm">
                    <span className="text-xs font-medium text-white">{video.duration}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex gap-2 items-start">
                  <div className="relative w-7 h-7 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={video.profileImage}
                      alt={video.artistName}
                      fill
                      className="object-cover"
                      sizes="28px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-2 leading-tight">
                      {video.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{video.artistName}</p>
                  </div>
                </div>
              </button>
            ))}
        </div>
      </main>
    </div>
  )
}
