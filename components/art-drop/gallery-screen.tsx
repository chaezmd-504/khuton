"use client"

import { ArrowLeft, Award } from "lucide-react"
import Image from "next/image"

interface GalleryItem {
  id: string
  title: string
  artistName: string
  thumbnail: string
  supportDate: string
  hasCertificate: boolean
}

const mockGalleryItems: GalleryItem[] = [
  {
    id: "1",
    title: "봄의 잔상 #3",
    artistName: "민준",
    thumbnail: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop",
    supportDate: "2024.03.15",
    hasCertificate: true,
  },
  {
    id: "2",
    title: "도시의 소음을 그리다",
    artistName: "소연",
    thumbnail: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400&h=400&fit=crop",
    supportDate: "2024.03.10",
    hasCertificate: true,
  },
  {
    id: "3",
    title: "점토로 빚는 새벽",
    artistName: "이현",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    supportDate: "2024.03.05",
    hasCertificate: true,
  },
  {
    id: "4",
    title: "기억의 색채 연구",
    artistName: "박일러스트",
    thumbnail: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop",
    supportDate: "2024.02.28",
    hasCertificate: true,
  },
  {
    id: "5",
    title: "파도 드로잉 라이브",
    artistName: "최웨이브",
    thumbnail: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop",
    supportDate: "2024.02.20",
    hasCertificate: true,
  },
  {
    id: "6",
    title: "조각 과정 : 균열",
    artistName: "지원",
    thumbnail: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=400&fit=crop",
    supportDate: "2024.02.15",
    hasCertificate: true,
  },
  {
    id: "7",
    title: "밤하늘의 이야기",
    artistName: "민준",
    thumbnail: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400&h=400&fit=crop",
    supportDate: "2024.02.10",
    hasCertificate: true,
  },
]

interface GalleryScreenProps {
  onBack: () => void
}

export function GalleryScreen({ onBack }: GalleryScreenProps) {
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
          <h1 className="text-lg font-bold text-foreground">나의 갤러리</h1>
        </div>
      </header>

      {/* Gallery grid */}
      <main className="max-w-[375px] mx-auto px-3 py-4">
        <div className="grid grid-cols-2 gap-3">
          {mockGalleryItems.map((item) => (
            <div key={item.id} className="group">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 375px) 50vw, 180px"
                />
                {/* Certificate badge */}
                {item.hasCertificate && (
                  <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-primary/90 flex items-center justify-center">
                    <Award className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                )}
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium text-foreground line-clamp-1">{item.title}</p>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-xs text-muted-foreground">{item.artistName}</p>
                  <p className="text-xs text-muted-foreground">{item.supportDate}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
