"use client"

import { useState, useRef } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { DropSheet } from "./drop-sheet"
import { REELS } from "@/lib/mock-data"

function DropIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C12 2 5 10.5 5 15a7 7 0 1 0 14 0c0-4.5-7-13-7-13z" />
      <text x="12" y="17" textAnchor="middle" fontSize="8" fill="currentColor" className="fill-background font-bold">$</text>
    </svg>
  )
}

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

function FrameIcon({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <rect x="6" y="6" width="12" height="12" rx="1" />
    </svg>
  )
}

interface FeedScreenProps {
  initialIndex?: number
  coins: number
  onCoinsChange: (newCoins: number) => void
  onArtistClick?: (artistId: string) => void
  onOpenDM?: (artistId: string) => void
}

export function FeedScreen({ initialIndex = 0, coins, onCoinsChange, onArtistClick, onOpenDM }: FeedScreenProps) {
  const safeIndex = initialIndex >= 0 && initialIndex < REELS.length ? initialIndex : 0
  const [currentIndex, setCurrentIndex] = useState(safeIndex)
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

  const reel = REELS[currentIndex]

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    currentY.current = e.touches[0].clientY
  }

  const handleTouchEnd = () => {
    const diff = startY.current - currentY.current
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < REELS.length - 1) {
        setCurrentIndex((prev) => prev + 1)
        setExpandedDescription(false)
      } else if (diff < 0 && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1)
        setExpandedDescription(false)
      }
    }
  }

  const handleDrop = () => {
    setDropAnimation(true)
    setTimeout(() => setDropAnimation(false), 500)
    setShowDropSheet(true)
  }

  const handleArchive = () => {
    const id = reel.id
    setSavedVideos((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 2000)
      }
      return next
    })
  }

  const handlePreference = (preference: "like" | "dislike") => {
    setShowPreferenceMenu(false)
    setPreferenceToast(
      preference === "like"
        ? "마음에 들어요! 비슷한 작품을 더 추천해드릴게요"
        : "취향이 아니군요. 추천에 반영할게요"
    )
    setTimeout(() => setPreferenceToast(null), 2000)
  }

  const handleDropComplete = (amount: number) => {
    onCoinsChange(coins - amount)
    setShowDropSheet(false)
  }

  return (
    <div className="absolute inset-0 bottom-16 bg-black">
      {/* Coin chip */}
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
        className="relative h-full w-full max-w-[375px] mx-auto overflow-hidden"
      >
        {/* YouTube iframe — key forces remount on index change */}
        <iframe
          key={currentIndex}
          src={`https://www.youtube.com/embed/${reel.videoId}?autoplay=1&mute=1&loop=1&controls=0&playlist=${reel.videoId}&rel=0&playsinline=1`}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ border: "none", pointerEvents: "none" }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />

        {/* Touch-capture layer — sits above iframe, below buttons */}
        <div
          className="absolute inset-0 z-10"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />

        {/* Right action bar */}
        <div className="absolute right-3 bottom-4 z-20 flex flex-col items-center gap-4">
          {/* Drop */}
          <button
            onClick={(e) => { e.stopPropagation(); handleDrop() }}
            className="flex flex-col items-center gap-1"
          >
            <div className={cn("w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center icon-shadow transition-transform", dropAnimation && "animate-drop-burst")}>
              <DropIcon className="w-7 h-7 text-white" />
            </div>
            <span className="text-xs text-white font-medium text-shadow">Drop</span>
          </button>

          {/* Connect */}
          <button
            onClick={(e) => { e.stopPropagation(); onOpenDM?.(reel.artist.handle) }}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center icon-shadow">
              <PaletteIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-white font-medium text-shadow">Connect</span>
          </button>

          {/* Archive */}
          <button
            onClick={(e) => { e.stopPropagation(); handleArchive() }}
            className="flex flex-col items-center gap-1"
          >
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center icon-shadow transition-colors", savedVideos.has(reel.id) ? "bg-secondary/90" : "bg-white/10 backdrop-blur-sm")}>
              <FrameIcon className="w-6 h-6 text-white" filled={savedVideos.has(reel.id)} />
            </div>
            <span className="text-xs text-white font-medium text-shadow">Archive</span>
          </button>

          {/* Spread */}
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

          {/* More */}
          <button
            onClick={(e) => { e.stopPropagation(); setShowPreferenceMenu(true) }}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center icon-shadow">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="6" r="1.5" />
                <circle cx="12" cy="18" r="1.5" />
              </svg>
            </div>
          </button>
        </div>

        {/* Left bottom: artist info + funding */}
        <div className="absolute left-4 right-20 bottom-4 z-20">
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-white/80 text-shadow">현재 {reel.fundingProgress}% 달성 중</span>
              <span className="text-xs text-white/60 text-shadow">{reel.fundingGoal.toLocaleString()}C</span>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
                style={{ width: `${reel.fundingProgress}%` }}
              />
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); onArtistClick?.(reel.artist.handle) }}
            className="flex items-center gap-2 mb-1"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted ring-2 ring-white/30 flex-shrink-0">
              <Image
                src={reel.artist.avatarUrl}
                alt={reel.artist.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <p className="text-white font-bold text-base text-shadow">{reel.artist.handle}</p>
            <span className="text-white/60">·</span>
            <p className="text-white font-semibold text-sm text-shadow truncate">{reel.title}</p>
          </button>

          <div onClick={(e) => { e.stopPropagation(); setExpandedDescription((v) => !v) }}>
            <p className={cn("text-white/80 text-sm text-shadow transition-all", expandedDescription ? "" : "line-clamp-1")}>
              {reel.description}
            </p>
            {!expandedDescription && reel.description.length > 30 && (
              <button className="text-white/60 text-sm mt-0.5">더 보기</button>
            )}
          </div>
        </div>
      </div>

      {/* Archive toast */}
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
          <div className="glass rounded-full px-4 py-2">
            <span className="text-white text-sm">{preferenceToast}</span>
          </div>
        </div>
      )}

      {/* Preference menu */}
      {showPreferenceMenu && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setShowPreferenceMenu(false)} />
          <div className="absolute bottom-0 left-0 right-0 z-50 animate-slide-up">
            <div className="bg-card rounded-t-3xl overflow-hidden">
              <div className="w-12 h-1 bg-muted rounded-full mx-auto mt-3" />
              <div className="p-4 space-y-2">
                <button onClick={() => handlePreference("like")} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-muted transition-colors">
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
                <button onClick={() => handlePreference("dislike")} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-muted transition-colors">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-red-500">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">취향이 아니에요</p>
                    <p className="text-sm text-muted-foreground">이런 작품은 덜 추천받아요</p>
                  </div>
                </button>
              </div>
              <div className="px-4 pb-6">
                <button onClick={() => setShowPreferenceMenu(false)} className="w-full py-3 rounded-xl bg-muted text-muted-foreground font-medium">취소</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Drop sheet */}
      {showDropSheet && (
        <DropSheet
          artist={{
            artistId: reel.artist.handle,
            artistName: reel.artist.name,
            profileImage: reel.artist.avatarUrl,
            fundingProgress: reel.fundingProgress,
          }}
          coins={coins}
          onClose={() => setShowDropSheet(false)}
          onDrop={handleDropComplete}
        />
      )}
    </div>
  )
}
