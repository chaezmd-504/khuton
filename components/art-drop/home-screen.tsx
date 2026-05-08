"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import Image from "next/image"
import { REELS, type Reel, type Category } from "@/lib/mock-data"
import { getRecommendedReels, getPreferenceLabel } from "@/lib/recommendation"
import { searchReels } from "@/lib/search"

export function HomeScreen() {
  const router = useRouter()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [displayedReels, setDisplayedReels] = useState<Reel[]>([])
  const [preferences, setPreferences] = useState<Category[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem("art-drop-preferences")
    let prefs: Category[] = []
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) prefs = parsed as Category[]
      } catch {}
    }
    setPreferences(prefs)
    setDisplayedReels(getRecommendedReels(prefs, REELS))
  }, [])

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!query.trim()) {
      setIsSearching(false)
      setDisplayedReels(getRecommendedReels(preferences, REELS))
      return
    }

    debounceRef.current = setTimeout(() => {
      setIsSearching(true)
      setDisplayedReels(searchReels(query, REELS))
    }, 300)
  }

  const handleClearSearch = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setSearchQuery("")
    setIsSearching(false)
    setIsSearchOpen(false)
    setDisplayedReels(getRecommendedReels(preferences, REELS))
  }

  const preferenceLabel =
    !isSearching && preferences.length > 0
      ? `✨ ${getPreferenceLabel(preferences)}`
      : null

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
                  placeholder="작가명, 작품명, 카테고리 검색"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 rounded-full bg-muted text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              </div>
              <button
                onClick={handleClearSearch}
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

        {/* Preference label pill */}
        {preferenceLabel && (
          <div className="max-w-[375px] mx-auto px-4 pb-2.5">
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-medium"
              style={{ backgroundColor: "rgba(124,58,237,0.15)", color: "#7C3AED" }}
            >
              {preferenceLabel}
            </span>
          </div>
        )}
      </header>

      {/* Content */}
      <main className="max-w-[375px] mx-auto px-3 py-4">
        {displayedReels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-4xl mb-3">🎨</span>
            <p className="text-muted-foreground">검색 결과가 없어요</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {displayedReels.map((reel, index) => (
              <button
                key={reel.id}
                onClick={() => router.push(`/feed?index=${index}`)}
                className="group relative flex flex-col gap-2 text-left"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-muted">
                  <Image
                    src={reel.thumbnailUrl}
                    alt={reel.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 375px) 50vw, 180px"
                    unoptimized
                  />
                  {/* Duration badge */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm">
                    <span className="text-xs font-medium text-white">{reel.duration}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex gap-2 items-start">
                  <div className="relative w-7 h-7 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={reel.artist.avatarUrl}
                      alt={reel.artist.name}
                      fill
                      className="object-cover"
                      sizes="28px"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-2 leading-tight">
                      {reel.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{reel.artist.name}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
