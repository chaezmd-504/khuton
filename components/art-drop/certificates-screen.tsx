"use client"

import { ArrowLeft } from "lucide-react"
import Image from "next/image"

interface Certificate {
  id: string
  certNumber: string
  title: string
  artistName: string
  thumbnail: string
  supportAmount: number
  supportDate: string
}

const mockCertificates: Certificate[] = [
  {
    id: "1",
    certNumber: "ART-2024-003821",
    title: "봄의 잔상 #3",
    artistName: "민준",
    thumbnail: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=200&h=200&fit=crop",
    supportAmount: 1000,
    supportDate: "2024.03.15",
  },
  {
    id: "2",
    certNumber: "ART-2024-003754",
    title: "도시의 소음을 그리다",
    artistName: "소연",
    thumbnail: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=200&h=200&fit=crop",
    supportAmount: 500,
    supportDate: "2024.03.10",
  },
  {
    id: "3",
    certNumber: "ART-2024-003689",
    title: "점토로 빚는 새벽",
    artistName: "이현",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop",
    supportAmount: 5000,
    supportDate: "2024.03.05",
  },
  {
    id: "4",
    certNumber: "ART-2024-003512",
    title: "기억의 색채 연구",
    artistName: "박일러스트",
    thumbnail: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&h=200&fit=crop",
    supportAmount: 1000,
    supportDate: "2024.02.28",
  },
  {
    id: "5",
    certNumber: "ART-2024-003398",
    title: "파도 드로잉 라이브",
    artistName: "최웨이브",
    thumbnail: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200&h=200&fit=crop",
    supportAmount: 500,
    supportDate: "2024.02.20",
  },
  {
    id: "6",
    certNumber: "ART-2024-003245",
    title: "조각 과정 : 균열",
    artistName: "지원",
    thumbnail: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=200&h=200&fit=crop",
    supportAmount: 100,
    supportDate: "2024.02.15",
  },
  {
    id: "7",
    certNumber: "ART-2024-003102",
    title: "밤하늘의 이야기",
    artistName: "민준",
    thumbnail: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=200&h=200&fit=crop",
    supportAmount: 1000,
    supportDate: "2024.02.10",
  },
]

interface CertificatesScreenProps {
  onBack: () => void
}

export function CertificatesScreen({ onBack }: CertificatesScreenProps) {
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

      {/* Certificate list */}
      <main className="max-w-[375px] mx-auto px-4 py-4 space-y-4">
        {mockCertificates.map((cert) => (
          <div
            key={cert.id}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-card to-secondary/20 p-[1px]"
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
                    src={cert.thumbnail}
                    alt={cert.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>

                {/* Certificate info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground line-clamp-1">{cert.title}</p>
                  <p className="text-sm text-muted-foreground">{cert.artistName}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">후원 금액</p>
                      <p className="text-sm font-semibold text-secondary">{cert.supportAmount.toLocaleString()} C</p>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div>
                      <p className="text-xs text-muted-foreground">후원 날짜</p>
                      <p className="text-sm font-medium text-foreground">{cert.supportDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Certificate number with ribbon */}
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
                  <span className="text-xs font-mono text-muted-foreground">{cert.certNumber}</span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-border via-border to-transparent" />
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
