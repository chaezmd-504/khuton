"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, X, ChevronDown, ChevronRight } from "lucide-react"
import Image from "next/image"
import logoSrc from "@/lib/logo.png"
import { REELS, CATEGORY_OPTIONS, type Reel, type Category } from "@/lib/mock-data"
import { getRecommendedReels } from "@/lib/recommendation"
import { searchReels } from "@/lib/search"

type SortType = "recommended" | "funding" | "latest"

const SORT_OPTIONS: { id: SortType; label: string }[] = [
  { id: "recommended", label: "추천순" },
  { id: "funding",     label: "펀딩 높은순" },
  { id: "latest",      label: "최신순" },
]

const ALL_CHIPS = [
  { id: "all", label: "전체", emoji: null as string | null },
  ...CATEGORY_OPTIONS.map((c) => ({ id: c.id, label: c.label, emoji: c.emoji as string | null })),
]

function applySortToBase(base: Reel[], sort: SortType, prefs: Category[]): Reel[] {
  if (sort === "funding") return [...base].sort((a, b) => b.fundingProgress - a.fundingProgress)
  if (sort === "latest")  return [...base].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return getRecommendedReels(prefs, base)
}

function chipLabel(chip: { id: string; label: string; emoji: string | null }) {
  return chip.emoji ? `${chip.emoji} ${chip.label}` : chip.label
}

export function HomeScreen() {
  const router = useRouter()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [displayedReels, setDisplayedReels] = useState<Reel[]>([])
  const [preferences, setPreferences] = useState<Category[]>([])
  const [isSearching, setIsSearching] = useState(false)
  // empty set = "전체"
  const [selectedChips, setSelectedChips] = useState<Set<string>>(new Set())
  const [showChipEditor, setShowChipEditor] = useState(false)
  const [sortType, setSortType] = useState<SortType>("recommended")
  const [showSortMenu, setShowSortMenu] = useState(false)
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
    const initial = prefs.length > 0 ? new Set<string>(prefs) : new Set<string>()
    setSelectedChips(initial)
    const base = initial.size === 0 ? REELS : REELS.filter((r) => initial.has(r.category))
    setDisplayedReels(applySortToBase(base, "recommended", prefs))
  }, [])

  const recompute = (chips: Set<string>, sort: SortType, prefs: Category[]) => {
    const base = chips.size === 0 ? REELS : REELS.filter((r) => chips.has(r.category))
    setDisplayedReels(applySortToBase(base, sort, prefs))
  }

  const toggleChip = (chipId: string) => {
    setSelectedChips((prev) => {
      let next: Set<string>
      if (chipId === "all") {
        next = new Set()
      } else {
        next = new Set(prev)
        if (next.has(chipId)) next.delete(chipId)
        else next.add(chipId)
      }
      recompute(next, sortType, preferences)
      return next
    })
  }

  const handleSortSelect = (sort: SortType) => {
    setSortType(sort)
    setShowSortMenu(false)
    recompute(selectedChips, sort, preferences)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!query.trim()) {
      setIsSearching(false)
      recompute(selectedChips, sortType, preferences)
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
    recompute(selectedChips, sortType, preferences)
  }

  const activeSortLabel = SORT_OPTIONS.find((s) => s.id === sortType)?.label ?? "추천순"

  // chips to show in collapsed bar
  const collapsedChips =
    selectedChips.size === 0
      ? [ALL_CHIPS[0]]
      : ALL_CHIPS.filter((c) => selectedChips.has(c.id))

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        {/* Logo / Search row */}
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
              <button onClick={handleClearSearch} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <Image src={logoSrc} alt="Art-Drop" height={32} width={140} className="h-8 w-auto object-contain" />
              <button onClick={() => setIsSearchOpen(true)} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Chip bar */}
        <div className="max-w-[375px] mx-auto px-4 pb-3">
          {showChipEditor ? (
            /* ── 편집 모드: 모든 칩 flex-wrap ── */
            <div>
              <div className="flex flex-wrap gap-2">
                {ALL_CHIPS.map((chip) => {
                  const isActive = chip.id === "all" ? selectedChips.size === 0 : selectedChips.has(chip.id)
                  return (
                    <button
                      key={chip.id}
                      onClick={() => toggleChip(chip.id)}
                      className="px-3 py-1.5 text-xs font-semibold transition-all"
                      style={{
                        borderRadius: "999px",
                        backgroundColor: isActive ? "#7C3AED" : "#1A1A1A",
                        color: isActive ? "#FFFFFF" : "#9CA3AF",
                      }}
                    >
                      {chipLabel(chip)}
                    </button>
                  )
                })}
              </div>
              <button
                onClick={() => setShowChipEditor(false)}
                className="mt-2 text-xs font-medium"
                style={{ color: "#7C3AED" }}
              >
                접기
              </button>
            </div>
          ) : (
            /* ── 기본 모드: 선택된 칩만 + >> 버튼 ── */
            <div className="flex items-center gap-2">
              {collapsedChips.map((chip) => (
                <div
                  key={chip.id}
                  className="px-3 py-1.5 text-xs font-semibold"
                  style={{
                    borderRadius: "999px",
                    backgroundColor: "#7C3AED",
                    color: "#FFFFFF",
                  }}
                >
                  {chipLabel(chip)}
                </div>
              ))}
              <button
                onClick={() => setShowChipEditor(true)}
                className="flex items-center gap-0.5 px-2 py-1.5 rounded-full text-xs font-semibold transition-colors"
                style={{ backgroundColor: "#1A1A1A", color: "#9CA3AF" }}
              >
                <ChevronRight className="w-3.5 h-3.5" />
                <ChevronRight className="w-3.5 h-3.5 -ml-2" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[375px] mx-auto px-3 py-4">
        {/* Sort dropdown */}
        {!isSearching && (
          <div className="flex justify-start mb-3 relative">
            <button
              onClick={() => setShowSortMenu((v) => !v)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {activeSortLabel}
              <ChevronDown className="w-3 h-3" />
            </button>

            {showSortMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowSortMenu(false)} />
                <div className="absolute left-0 top-8 z-50 bg-card border border-border rounded-xl shadow-lg overflow-hidden min-w-[120px]">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleSortSelect(opt.id)}
                      className="w-full px-4 py-2.5 text-xs text-left transition-colors hover:bg-muted"
                      style={{
                        color: sortType === opt.id ? "#7C3AED" : undefined,
                        fontWeight: sortType === opt.id ? 600 : 400,
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {displayedReels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-4xl mb-3">🎨</span>
            <p className="text-muted-foreground">검색 결과가 없어요</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {displayedReels.map((reel) => (
              <button
                key={reel.id}
                onClick={() => router.push(`/feed?id=${reel.id}`)}
                className="group relative flex flex-col gap-2 text-left"
              >
                <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-muted">
                  <Image
                    src={reel.thumbnailUrl}
                    alt={reel.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 375px) 50vw, 180px"
                    unoptimized
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm">
                    <span className="text-xs font-medium text-white">{reel.duration}</span>
                  </div>
                </div>

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
