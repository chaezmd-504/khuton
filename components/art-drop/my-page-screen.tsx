"use client"

import { useState } from "react"
import { ChevronRight, Coins, Award, Bookmark } from "lucide-react"
import Image from "next/image"
import { CoinChargeSheet } from "./coin-charge-sheet"
import { GalleryScreen } from "./gallery-screen"
import { CertificatesScreen } from "./certificates-screen"
import { SavedWorksScreen } from "./saved-works-screen"
import { useCoinStore } from "@/store/coin-store"
import { useArchiveStore } from "@/store/archive-store"

export function MyPageScreen() {
  const { balance, addCoin, dropCount, totalSpent } = useCoinStore()
  const { archivedIds } = useArchiveStore()

  const [showChargeSheet, setShowChargeSheet] = useState(false)
  const [showGallery, setShowGallery] = useState(false)
  const [showCertificates, setShowCertificates] = useState(false)
  const [showSavedWorks, setShowSavedWorks] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }

  const user = {
    name: "아트러버",
    email: "artlover@example.com",
    profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face",
  }

  if (showGallery) {
    return <GalleryScreen onBack={() => setShowGallery(false)} />
  }

  if (showCertificates) {
    return <CertificatesScreen onBack={() => setShowCertificates(false)} />
  }

  if (showSavedWorks) {
    return <SavedWorksScreen onBack={() => setShowSavedWorks(false)} />
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="max-w-[375px] mx-auto h-14 px-4 flex items-center">
          <h1 className="text-lg font-bold text-foreground">MY</h1>
        </div>
      </header>

      <main className="max-w-[375px] mx-auto">
        {/* Profile section */}
        <div className="p-6 flex flex-col items-center">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-muted ring-4 ring-primary/20">
            <Image
              src={user.profileImage}
              alt={user.name}
              fill
              className="object-cover"
            />
          </div>
          <h2 className="mt-4 text-xl font-bold text-foreground">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>

          {/* Stats */}
          <div className="mt-6 w-full grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-3 rounded-xl bg-card">
              <p className="text-2xl font-bold text-primary">{dropCount}</p>
              <p className="text-xs text-muted-foreground mt-1">후원한 작품</p>
            </div>
            <div className="flex flex-col items-center p-3 rounded-xl bg-card">
              <p className="text-lg font-bold text-secondary leading-tight">{totalSpent.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">C 누적 후원</p>
            </div>
            <div className="flex flex-col items-center p-3 rounded-xl bg-card">
              <p className="text-2xl font-bold text-foreground">{archivedIds.size}</p>
              <p className="text-xs text-muted-foreground mt-1">소장 작품</p>
            </div>
          </div>
        </div>

        {/* Menu section */}
        <div className="mt-2 px-4 space-y-2">
          {/* Coin charge */}
          <button
            onClick={() => setShowChargeSheet(true)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card hover:bg-card/80 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
              <Coins className="w-6 h-6 text-secondary" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-foreground">코인 충전</p>
              <p className="text-sm text-muted-foreground">현재 잔액: {balance.toLocaleString()} C</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Sponsored works (Digital gallery) */}
          <button
            onClick={() => setShowGallery(true)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card hover:bg-card/80 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-foreground">후원한 작품</p>
              <p className="text-sm text-muted-foreground">내가 Drop한 작품들</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                {dropCount}
              </span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </button>

          {/* Digital certificates */}
          <button
            onClick={() => setShowCertificates(true)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card hover:bg-card/80 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-primary">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M12 8v8" />
                <path d="M8 12h8" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-foreground">디지털 인증서</p>
              <p className="text-sm text-muted-foreground">후원 시 발급된 인증서</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Saved works (Archive) */}
          <button
            onClick={() => setShowSavedWorks(true)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card hover:bg-card/80 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Bookmark className="w-6 h-6 text-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-foreground">저장한 작품</p>
              <p className="text-sm text-muted-foreground">Archive에 저장한 작품들</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-semibold">
                {archivedIds.size}
              </span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </button>
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap">
          <div className="bg-foreground text-background rounded-full px-4 py-2 text-sm font-medium shadow-lg">
            {toast}
          </div>
        </div>
      )}

      {/* Coin charge sheet */}
      {showChargeSheet && (
        <CoinChargeSheet
          currentCoins={balance}
          onClose={() => setShowChargeSheet(false)}
          onCharge={(amount) => {
            addCoin(amount)
            setShowChargeSheet(false)
            showToast("충전 완료! 🎉")
          }}
        />
      )}
    </div>
  )
}
