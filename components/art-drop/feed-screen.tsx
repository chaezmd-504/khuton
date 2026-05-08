"use client"

import { useState, useRef } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { REELS } from "@/lib/mock-data"
import { useCoinStore } from "@/store/coin-store"
import { useArchiveStore } from "@/store/archive-store"

// ── SVG icon components ──────────────────────────────────────────────────────

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

// ── Constants ─────────────────────────────────────────────────────────────────

const DROP_AMOUNTS = [
  { value: 100,  label: "100C"   },
  { value: 500,  label: "500C"   },
  { value: 1000, label: "1,000C" },
]

// ── Component ─────────────────────────────────────────────────────────────────

interface FeedScreenProps {
  initialIndex?: number
  onArtistClick?: (artistId: string) => void
  onOpenDM?: (artistId: string) => void
}

export function FeedScreen({ initialIndex = 0, onArtistClick, onOpenDM }: FeedScreenProps) {
  const safeIndex = initialIndex >= 0 && initialIndex < REELS.length ? initialIndex : 0

  // ── navigation state ──
  const [currentIndex, setCurrentIndex]   = useState(safeIndex)
  const [touchStartY, setTouchStartY]     = useState(0)
  const [expandedDesc, setExpandedDesc]   = useState(false)

  // ── action state ──
  const [dropAnimation, setDropAnimation]     = useState(false)
  const [showDropSheet, setShowDropSheet]     = useState(false)
  const [selectedAmount, setSelectedAmount]   = useState<number | null>(null)
  const [customAmount, setCustomAmount]       = useState("")
  const [isCustomAmount, setIsCustomAmount]   = useState(false)
  const [spreadIds, setSpreadIds]             = useState<Set<string>>(new Set())
  const [showPreferenceMenu, setShowPreferenceMenu] = useState(false)
  const wheelCooldown = useRef(false)

  // ── funding local overrides ──
  const [fundingOverrides, setFundingOverrides] = useState<Record<string, number>>({})

  // ── toast ──
  const [toast, setToast] = useState<string | null>(null)

  // ── stores ──
  const { balance, deductCoin } = useCoinStore()
  const { toggleArchive, isArchived } = useArchiveStore()

  const reel            = REELS[currentIndex]
  const effectiveProgress = fundingOverrides[reel.id] ?? reel.fundingProgress
  const effectiveDrop   = isCustomAmount ? Number(customAmount) || 0 : selectedAmount ?? 0

  // ── helpers ──────────────────────────────────────────────────────────────────

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }

  // ── touch swipe ──────────────────────────────────────────────────────────────

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.targetTouches[0].clientY)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY
    if (touchStartY - touchEndY > 50 && currentIndex < REELS.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setExpandedDesc(false)
    } else if (touchEndY - touchStartY > 50 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
      setExpandedDesc(false)
    }
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (wheelCooldown.current) return
    const next =
      e.deltaY > 0
        ? Math.min(currentIndex + 1, REELS.length - 1)
        : Math.max(currentIndex - 1, 0)
    if (next === currentIndex) return
    setCurrentIndex(next)
    setExpandedDesc(false)
    wheelCooldown.current = true
    setTimeout(() => { wheelCooldown.current = false }, 800)
  }

  // ── actions ──────────────────────────────────────────────────────────────────

  const handleDropButtonClick = () => {
    setDropAnimation(true)
    setTimeout(() => setDropAnimation(false), 500)
    setShowDropSheet(true)
  }

  const handleDrop = () => {
    if (effectiveDrop <= 0) return
    const success = deductCoin(effectiveDrop)
    if (!success) {
      showToast("코인이 부족해요 💰")
      return
    }
    const added = (effectiveDrop / reel.fundingGoal) * 100
    setFundingOverrides((prev) => ({
      ...prev,
      [reel.id]: Math.min(100, (prev[reel.id] ?? reel.fundingProgress) + added),
    }))
    showToast("Drop 완료! 🎉")
    setShowDropSheet(false)
    setSelectedAmount(null)
    setCustomAmount("")
    setIsCustomAmount(false)
  }

  const handleSpread = async () => {
    const url = `${window.location.origin}/feed?index=${currentIndex}`
    setSpreadIds((prev) => { const n = new Set(prev); n.add(reel.id); return n })
    if (typeof navigator !== "undefined" && navigator.share) {
      try { await navigator.share({ title: reel.title, url }) } catch { /* cancelled */ }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url)
      showToast("링크가 복사됐어요 🔗")
    }
  }

  const handleArchive = () => {
    const wasArchived = isArchived(reel.id)
    toggleArchive(reel.id)
    showToast(wasArchived ? "갤러리에서 제거됐어요" : "갤러리에 저장됐어요 🖼️")
  }

  // ── render ───────────────────────────────────────────────────────────────────

  return (
    <div className="absolute inset-0 bottom-16 bg-black">

      {/* Coin chip ─ z-50 */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <div className="glass rounded-full px-4 py-1.5 flex items-center gap-1.5">
          <span className="text-lg">💰</span>
          <span className="text-white font-semibold text-sm">
            {balance.toLocaleString()} C
          </span>
        </div>
      </div>

      {/* Video container — touch handlers here so swipe works over buttons too */}
      <div
        className="relative h-full w-full max-w-[375px] mx-auto overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >

        {/* YouTube iframe — key forces remount on swipe */}
        <iframe
          key={currentIndex}
          src={`https://www.youtube.com/embed/${reel.videoId}?autoplay=1&mute=1&loop=1&controls=0&playlist=${reel.videoId}&rel=0&playsinline=1`}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ border: "none", pointerEvents: "none" }}
        />

        {/* Gradient overlay ─ pointer-events-none so touch falls through */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />

        {/* Touch-capture layer — transparent, prevents iframe from stealing events */}
        <div className="absolute inset-0 z-10" />

        {/* ── Right action bar ─ z-20 ── */}
        <div className="absolute right-3 bottom-4 z-20 flex flex-col items-center gap-4">

          {/* Drop */}
          <button onClick={(e) => { e.stopPropagation(); handleDropButtonClick() }} className="flex flex-col items-center gap-1">
            <div className={cn("w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center icon-shadow transition-transform", dropAnimation && "animate-drop-burst")}>
              <DropIcon className="w-7 h-7 text-white" />
            </div>
            <span className="text-xs text-white font-medium text-shadow">Drop</span>
          </button>

          {/* Connect */}
          <button onClick={(e) => { e.stopPropagation(); onOpenDM?.(reel.artist.handle) }} className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center icon-shadow">
              <PaletteIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-white font-medium text-shadow">Connect</span>
          </button>

          {/* Spread */}
          <button onClick={(e) => { e.stopPropagation(); handleSpread() }} className="flex flex-col items-center gap-1">
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center icon-shadow transition-colors", spreadIds.has(reel.id) ? "bg-primary/90" : "bg-white/10 backdrop-blur-sm")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </div>
            <span className="text-xs text-white font-medium text-shadow">Spread</span>
          </button>

          {/* Archive */}
          <button onClick={(e) => { e.stopPropagation(); handleArchive() }} className="flex flex-col items-center gap-1">
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center icon-shadow transition-colors", isArchived(reel.id) ? "bg-secondary/90" : "bg-white/10 backdrop-blur-sm")}>
              <FrameIcon className="w-6 h-6 text-white" filled={isArchived(reel.id)} />
            </div>
            <span className="text-xs text-white font-medium text-shadow">Archive</span>
          </button>

          {/* More */}
          <button onClick={(e) => { e.stopPropagation(); setShowPreferenceMenu(true) }} className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center icon-shadow">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                <circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="6" r="1.5" /><circle cx="12" cy="18" r="1.5" />
              </svg>
            </div>
          </button>
        </div>

        {/* ── Left bottom: funding + artist info ─ z-20 ── */}
        <div className="absolute left-4 right-20 bottom-4 z-20">
          {/* Funding bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-white/80 text-shadow">현재 {Math.round(effectiveProgress)}% 달성 중</span>
              <span className="text-xs text-white/60 text-shadow">{reel.fundingGoal.toLocaleString()}C</span>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                style={{ width: `${effectiveProgress}%` }}
              />
            </div>
          </div>

          {/* Artist info */}
          <button onClick={(e) => { e.stopPropagation(); onArtistClick?.(reel.artist.handle) }} className="flex items-center gap-2 mb-1">
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted ring-2 ring-white/30 flex-shrink-0">
              <Image src={reel.artist.avatarUrl} alt={reel.artist.name} fill className="object-cover" unoptimized />
            </div>
            <p className="text-white font-bold text-base text-shadow">{reel.artist.handle}</p>
            <span className="text-white/60">·</span>
            <p className="text-white font-semibold text-sm text-shadow truncate">{reel.title}</p>
          </button>

          {/* Description */}
          <div onClick={(e) => { e.stopPropagation(); setExpandedDesc((v) => !v) }}>
            <p className={cn("text-white/80 text-sm text-shadow", expandedDesc ? "" : "line-clamp-1")}>
              {reel.description}
            </p>
            {!expandedDesc && reel.description.length > 30 && (
              <span className="text-white/60 text-sm mt-0.5">더 보기</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Toast ─ z-50 ── */}
      {toast && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 animate-slide-up whitespace-nowrap">
          <div className="glass rounded-full px-4 py-2">
            <span className="text-white text-sm">{toast}</span>
          </div>
        </div>
      )}

      {/* ── Preference menu ── */}
      {showPreferenceMenu && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setShowPreferenceMenu(false)} />
          <div className="absolute bottom-0 left-0 right-0 z-50 animate-slide-up">
            <div className="bg-card rounded-t-3xl overflow-hidden">
              <div className="w-12 h-1 bg-muted rounded-full mx-auto mt-3" />
              <div className="p-4 space-y-2">
                <button
                  onClick={() => { setShowPreferenceMenu(false); showToast("마음에 들어요! 비슷한 작품을 더 추천해드릴게요") }}
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
                  onClick={() => { setShowPreferenceMenu(false); showToast("취향이 아니군요. 추천에 반영할게요") }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-muted transition-colors"
                >
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

      {/* ── Drop Bottom Sheet ── */}
      {showDropSheet && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50 animate-fade-in" onClick={() => setShowDropSheet(false)} />
          <div className="absolute bottom-0 left-0 right-0 z-50 animate-slide-up">
            <div className="max-w-[375px] mx-auto bg-card rounded-t-3xl overflow-hidden">
              {/* Sheet header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-bold text-foreground">후원하기 — Drop</h2>
                <button onClick={() => setShowDropSheet(false)} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Artist summary */}
              <div className="p-4 flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                  <Image src={reel.artist.avatarUrl} alt={reel.artist.name} fill className="object-cover" unoptimized />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{reel.artist.name}</p>
                  <p className="text-sm text-muted-foreground">{reel.artist.handle}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">달성률</p>
                  <p className="font-bold text-primary">{Math.round(effectiveProgress)}%</p>
                </div>
              </div>

              {/* Amount chips */}
              <div className="px-4 pb-4">
                <p className="text-sm text-muted-foreground mb-3">후원 금액 선택</p>
                <div className="grid grid-cols-4 gap-2">
                  {DROP_AMOUNTS.map((a) => (
                    <button
                      key={a.value}
                      onClick={() => { setSelectedAmount(a.value); setIsCustomAmount(false); setCustomAmount("") }}
                      className={cn(
                        "h-12 rounded-xl font-semibold text-sm transition-all",
                        selectedAmount === a.value && !isCustomAmount
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground hover:bg-muted/80"
                      )}
                    >
                      {a.label}
                    </button>
                  ))}
                  <button
                    onClick={() => { setIsCustomAmount(true); setSelectedAmount(null) }}
                    className={cn(
                      "h-12 rounded-xl font-semibold text-sm transition-all",
                      isCustomAmount ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"
                    )}
                  >
                    직접입력
                  </button>
                </div>
                {isCustomAmount && (
                  <div className="mt-3 relative">
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="금액 입력"
                      autoFocus
                      className="w-full h-12 px-4 pr-12 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">C</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 bg-muted/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">보유 코인</span>
                  <span className="font-semibold text-foreground">{balance.toLocaleString()} C</span>
                </div>
                <button
                  onClick={handleDrop}
                  disabled={effectiveDrop <= 0}
                  className={cn(
                    "w-full h-14 rounded-full font-bold text-lg transition-all",
                    effectiveDrop > 0
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  Drop!
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
