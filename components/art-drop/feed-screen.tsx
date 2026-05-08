"use client"

import { useState, useRef } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { DropSheet } from "./drop-sheet"

interface Video {
  id: string
  artistId: string
  artistName: string
  title: string
  description: string
  thumbnail: string
  profileImage: string
  fundingProgress: number
  fundingGoal: string
}

const mockVideos: Video[] = [
  {
    id: "1",
    artistId: "@minjun_art",
    artistName: "민준",
    title: "봄의 잔상 #3",
    description: "봄의 잔상을 수채화로 담은 시리즈 3번째 작품입니다. 벚꽃이 지는 순간의 아름다움과 덧없음을 담았습니다. 수채화 특유의 투명한 레이어링 기법으로 빛과 그림자를 표현했어요.",
    thumbnail: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=1067&fit=crop",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    fundingProgress: 82,
    fundingGoal: "500,000C",
  },
  {
    id: "2",
    artistId: "@soyeon.draws",
    artistName: "소연",
    title: "도시의 소음을 그리다",
    description: "도시의 혼잡함을 추상적으로 표현한 작품입니다. 매일 지나치는 거리의 소음들, 자동차 경적, 사람들의 발걸음 소리를 색과 선으로 담아봤어요. 여러분은 어떤 소리가 들리시나요?",
    thumbnail: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&h=1067&fit=crop",
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    fundingProgress: 45,
    fundingGoal: "300,000C",
  },
  {
    id: "3",
    artistId: "@leehyun_studio",
    artistName: "이현",
    title: "점토로 빚는 새벽",
    description: "새벽의 고요함을 점토로 표현하는 과정을 담았습니다. 아무도 깨어있지 않은 시간, 작업실에서 혼자 흙을 빚는 시간이 제일 좋아요. 이 작품은 그 순간의 평온함을 담고 있습니다.",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=1067&fit=crop",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    fundingProgress: 67,
    fundingGoal: "1,000,000C",
  },
  {
    id: "4",
    artistId: "@park.illust",
    artistName: "박일러스트",
    title: "기억의 색채 연구",
    description: "기억 속 색채를 디지털로 재해석하는 시리즈입니다. 어릴 적 할머니 댁의 따뜻한 노란빛, 첫사랑의 분홍빛 설렘... 우리 모두의 기억에는 고유한 색이 있다고 생각해요.",
    thumbnail: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=1067&fit=crop",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    fundingProgress: 91,
    fundingGoal: "200,000C",
  },
]

// Drop icon SVG component
function DropIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C12 2 5 10.5 5 15a7 7 0 1 0 14 0c0-4.5-7-13-7-13z" />
      <text x="12" y="17" textAnchor="middle" fontSize="8" fill="currentColor" className="fill-background font-bold">$</text>
    </svg>
  )
}

// Palette icon SVG component
function PaletteIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c0.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.688H16c3.314 0 6-2.686 6-6 0-5-4-9-10-9z" />
    </svg>
  )
}

// Frame icon SVG component
function FrameIcon({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <rect x="6" y="6" width="12" height="12" rx="1" />
    </svg>
  )
}

interface FeedScreenProps {
  initialVideoId?: string
  coins: number
  onCoinsChange: (newCoins: number) => void
  onArtistClick?: (artistId: string) => void
  onOpenDM?: (artistId: string) => void
}

export function FeedScreen({ initialVideoId, coins, onCoinsChange, onArtistClick, onOpenDM }: FeedScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (initialVideoId) {
      const idx = mockVideos.findIndex((v) => v.id === initialVideoId)
      return idx >= 0 ? idx : 0
    }
    return 0
  })
  const [isPlaying, setIsPlaying] = useState(true)
  const [showDropSheet, setShowDropSheet] = useState(false)
  const [savedVideos, setSavedVideos] = useState<Set<string>>(new Set())
  const [dropAnimation, setDropAnimation] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [expandedDescription, setExpandedDescription] = useState(false)
  const [showPreferenceMenu, setShowPreferenceMenu] = useState(false)
  const [preferenceToast, setPreferenceToast] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const currentY = useRef(0)

  const currentVideo = mockVideos[currentIndex]

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    currentY.current = e.touches[0].clientY
  }

  const handleTouchEnd = () => {
    const diff = startY.current - currentY.current
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < mockVideos.length - 1) {
        setCurrentIndex((prev) => prev + 1)
        setExpandedDescription(false)
      } else if (diff < 0 && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1)
        setExpandedDescription(false)
      }
    }
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleDrop = () => {
    setDropAnimation(true)
    setTimeout(() => setDropAnimation(false), 500)
    setShowDropSheet(true)
  }

  const handleArchive = () => {
    const videoId = currentVideo.id
    setSavedVideos((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(videoId)) {
        newSet.delete(videoId)
      } else {
        newSet.add(videoId)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 2000)
      }
      return newSet
    })
  }

  const handlePreference = (preference: "like" | "dislike") => {
    setShowPreferenceMenu(false)
    if (preference === "like") {
      setPreferenceToast("마음에 들어요! 비슷한 작품을 더 추천해드릴게요")
    } else {
      setPreferenceToast("취향이 아니군요. 추천에 반영할게요")
    }
    setTimeout(() => setPreferenceToast(null), 2000)
  }

  const handleDropComplete = (amount: number) => {
    onCoinsChange(coins - amount)
    setShowDropSheet(false)
  }

  return (
    <div className="absolute inset-0 bottom-16 bg-black">
      {/* Coin chip - top center */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
        <div className="glass rounded-full px-4 py-1.5 flex items-center gap-1.5">
          <span className="text-lg">💰</span>
          <span className={cn("text-white font-semibold text-sm", coins !== 12500 && "animate-coin-decrease")}>
            {coins.toLocaleString()} C
          </span>
        </div>
      </div>

      {/* Video container */}
      <div
        ref={containerRef}
        className="relative h-full w-full max-w-[375px] mx-auto"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handlePlayPause}
      >
        {/* Video background */}
        <div className="absolute inset-0">
          <Image
            src={currentVideo.thumbnail}
            alt={currentVideo.title}
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        </div>

        {/* Play/Pause indicator */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center z-10 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-white border-b-[15px] border-b-transparent ml-2" />
            </div>
          </div>
        )}

        {/* Right action bar */}
        <div className="absolute right-3 bottom-4 z-20 flex flex-col items-center gap-4">
          {/* Drop button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDrop()
            }}
            className="flex flex-col items-center gap-1"
          >
            <div className={cn("w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center icon-shadow transition-transform", dropAnimation && "animate-drop-burst")}>
              <DropIcon className="w-7 h-7 text-white" />
            </div>
            <span className="text-xs text-white font-medium text-shadow">Drop</span>
          </button>

          {/* Connect button - opens DM */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onOpenDM?.(currentVideo.artistId)
            }}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center icon-shadow">
              <PaletteIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-white font-medium text-shadow">Connect</span>
          </button>

          {/* Archive button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleArchive()
            }}
            className="flex flex-col items-center gap-1"
          >
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center icon-shadow transition-colors", savedVideos.has(currentVideo.id) ? "bg-secondary/90" : "bg-white/10 backdrop-blur-sm")}>
              <FrameIcon className="w-6 h-6 text-white" filled={savedVideos.has(currentVideo.id)} />
            </div>
            <span className="text-xs text-white font-medium text-shadow">Archive</span>
          </button>

          {/* Share button */}
          <button
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center icon-shadow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </div>
            <span className="text-xs text-white font-medium text-shadow">Spread</span>
          </button>

          {/* More options button (preference) */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowPreferenceMenu(true)
            }}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center icon-shadow">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-white"
              >
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="6" r="1.5" />
                <circle cx="12" cy="18" r="1.5" />
              </svg>
            </div>
          </button>
        </div>

        {/* Left bottom: Artist info */}
        <div className="absolute left-4 right-20 bottom-4 z-20">
          {/* Funding progress bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-white/80 text-shadow">현재 {currentVideo.fundingProgress}% 달성 중</span>
              <span className="text-xs text-white/60 text-shadow">{currentVideo.fundingGoal}</span>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
                style={{ width: `${currentVideo.fundingProgress}%` }}
              />
            </div>
          </div>

          {/* Artist info - Instagram Reels style with profile photo */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onArtistClick?.(currentVideo.artistId)
            }}
            className="flex items-center gap-2 mb-1"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted ring-2 ring-white/30 flex-shrink-0">
              <Image
                src={currentVideo.profileImage}
                alt={currentVideo.artistName}
                fill
                className="object-cover"
              />
            </div>
            <p className="text-white font-bold text-base text-shadow">{currentVideo.artistId}</p>
            <span className="text-white/60">·</span>
            <p className="text-white font-semibold text-sm text-shadow truncate">{currentVideo.title}</p>
          </button>
          
          {/* Description with expand/collapse */}
          <div 
            onClick={(e) => {
              e.stopPropagation()
              setExpandedDescription(!expandedDescription)
            }}
          >
            <p className={cn(
              "text-white/80 text-sm text-shadow transition-all",
              expandedDescription ? "" : "line-clamp-1"
            )}>
              {currentVideo.description}
            </p>
            {!expandedDescription && currentVideo.description.length > 30 && (
              <button className="text-white/60 text-sm mt-0.5">더 보기</button>
            )}
          </div>
        </div>
      </div>

      {/* Toast notification */}
      {showToast && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="glass rounded-full px-4 py-2 flex items-center gap-2">
            <FrameIcon className="w-4 h-4 text-secondary" filled />
            <span className="text-white text-sm">갤러리에 저장되었습니다</span>
          </div>
        </div>
      )}

      {/* Preference toast */}
      {preferenceToast && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="glass rounded-full px-4 py-2 flex items-center gap-2">
            <span className="text-white text-sm">{preferenceToast}</span>
          </div>
        </div>
      )}

      {/* Preference menu bottom sheet */}
      {showPreferenceMenu && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => setShowPreferenceMenu(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 z-50 animate-slide-up">
            <div className="bg-card rounded-t-3xl overflow-hidden">
              <div className="w-12 h-1 bg-muted rounded-full mx-auto mt-3" />
              <div className="p-4 space-y-2">
                <button
                  onClick={() => handlePreference("like")}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-muted transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-green-500">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">마음에 들어요</p>
                    <p className="text-sm text-muted-foreground">비슷한 작품을 더 추천받아요</p>
                  </div>
                </button>
                <button
                  onClick={() => handlePreference("dislike")}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-muted transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-red-500">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">취향이 아니에요</p>
                    <p className="text-sm text-muted-foreground">이런 작품은 덜 추천받아요</p>
                  </div>
                </button>
              </div>
              <div className="px-4 pb-6">
                <button
                  onClick={() => setShowPreferenceMenu(false)}
                  className="w-full py-3 rounded-xl bg-muted text-muted-foreground font-medium"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Drop bottom sheet */}
      {showDropSheet && (
        <DropSheet
          artist={currentVideo}
          coins={coins}
          onClose={() => setShowDropSheet(false)}
          onDrop={handleDropComplete}
        />
      )}
    </div>
  )
}
