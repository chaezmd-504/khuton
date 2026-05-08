"use client"

import Image from "next/image"
import { ArrowLeft, Play } from "lucide-react"

interface SavedWork {
  id: string
  thumbnail: string
  artistId: string
  artistName: string
  title: string
}

const mockSavedWorks: SavedWork[] = [
  {
    id: "1",
    thumbnail: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300&h=300&fit=crop",
    artistId: "@minjun_art",
    artistName: "민준",
    title: "봄의 잔상 #3",
  },
  {
    id: "2",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
    artistId: "@leehyun_studio",
    artistName: "이현",
    title: "점토로 빚는 새벽",
  },
  {
    id: "3",
    thumbnail: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=300&fit=crop",
    artistId: "@park.illust",
    artistName: "박일러스트",
    title: "기억의 색채 연구",
  },
]

interface SavedWorksScreenProps {
  onBack: () => void
}

export function SavedWorksScreen({ onBack }: SavedWorksScreenProps) {
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
        {mockSavedWorks.length > 0 ? (
          <div className="grid grid-cols-3 gap-0.5">
            {mockSavedWorks.map((work) => (
              <button
                key={work.id}
                className="relative aspect-[3/4] bg-muted group"
              >
                <Image
                  src={work.thumbnail}
                  alt={work.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-8 h-8 text-white" fill="white" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-xs text-white font-medium truncate">{work.artistName}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-8 h-8 text-muted-foreground"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <rect x="6" y="6" width="12" height="12" rx="1" />
              </svg>
            </div>
            <p className="text-muted-foreground">저장한 작품이 없습니다</p>
            <p className="text-sm text-muted-foreground mt-1">
              피드에서 Archive 버튼을 눌러 저장해보세요
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
