"use client"

import { useState } from "react"
import { ChevronRight, Coins, Award } from "lucide-react"
import Image from "next/image"
import { CoinChargeSheet } from "./coin-charge-sheet"
import { GalleryScreen } from "./gallery-screen"
import { CertificatesScreen } from "./certificates-screen"
import { SavedWorksScreen } from "./saved-works-screen"
import { OrderHistoryScreen } from "./order-history-screen"
import { useCoinStore } from "@/store/coin-store"
import { useArchiveStore } from "@/store/archive-store"
import { useOrderStore } from "@/store/order-store"
import { useSubscribeStore } from "@/store/subscribe-store"
import { ALL_BADGES, getEarnedBadgeIds } from "@/lib/badges"

export function MyPageScreen() {
  const { balance, addCoin, dropCount, totalSpent } = useCoinStore()
  const { archivedIds } = useArchiveStore()
  const { orders } = useOrderStore()
  const { subscribedIds } = useSubscribeStore()

  const earnedBadgeIds = getEarnedBadgeIds({
    isLoggedIn: true,
    dropCount,
    totalSpent,
    archivedCount: archivedIds.size,
    orderCount: orders.length,
    subscribedCount: subscribedIds.size,
  })

  const [showChargeSheet, setShowChargeSheet] = useState(false)
  const [showGallery, setShowGallery] = useState(false)
  const [showCertificates, setShowCertificates] = useState(false)
  const [showSavedWorks, setShowSavedWorks] = useState(false)
  const [showOrderHistory, setShowOrderHistory] = useState(false)
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

  if (showOrderHistory) {
    return <OrderHistoryScreen onBack={() => setShowOrderHistory(false)} />
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
              <p className="text-xl font-bold text-primary">{dropCount}</p>
              <p className="text-xs text-muted-foreground mt-1">후원한 작품</p>
            </div>
            <div className="flex flex-col items-center p-3 rounded-xl bg-card">
              <p className="text-xl font-bold text-secondary leading-tight">{totalSpent.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">C 누적 후원</p>
            </div>
            <button
              onClick={() => setShowOrderHistory(true)}
              className="flex flex-col items-center p-3 rounded-xl bg-card active:opacity-70 transition-opacity"
            >
              <p className="text-xl font-bold text-foreground">{orders.length}</p>
              <p className="text-xs text-muted-foreground mt-1">주문 내역</p>
            </button>
          </div>
        </div>

        {/* Badge section */}
        <div className="mt-2 px-4">
          <div className="bg-card rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-foreground text-sm">나의 배지</h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "rgba(255,133,161,0.15)", color: "#FF85A1" }}>
                {earnedBadgeIds.size} / {ALL_BADGES.length} 획득
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {ALL_BADGES.map((badge) => {
                const earned = earnedBadgeIds.has(badge.id)
                return (
                  <div
                    key={badge.id}
                    className="flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl transition-all"
                    style={{
                      backgroundColor: earned ? "rgba(255,133,161,0.1)" : "#F3F4F6",
                      opacity: earned ? 1 : 0.45,
                    }}
                    title={earned ? badge.desc : badge.hint}
                  >
                    <span style={{ fontSize: "1.5rem", lineHeight: 1, filter: earned ? "none" : "grayscale(1)" }}>
                      {badge.emoji}
                    </span>
                    <span
                      className="text-[9px] font-semibold text-center leading-tight"
                      style={{ color: earned ? "#FF85A1" : "#9CA3AF" }}
                    >
                      {badge.name}
                    </span>
                  </div>
                )
              })}
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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-foreground">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <rect x="6" y="6" width="12" height="12" rx="1" />
              </svg>
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
