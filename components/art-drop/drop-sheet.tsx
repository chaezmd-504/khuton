"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface Artist {
  artistId: string
  artistName: string
  profileImage: string
  fundingProgress: number
}

interface DropSheetProps {
  artist: Artist
  coins: number
  onClose: () => void
  onDrop: (amount: number) => void
}

const amounts = [
  { value: 100, label: "100C" },
  { value: 500, label: "500C" },
  { value: 1000, label: "1,000C" },
]

export function DropSheet({ artist, coins, onClose, onDrop }: DropSheetProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [isCustom, setIsCustom] = useState(false)

  const effectiveAmount = isCustom ? Number(customAmount) || 0 : selectedAmount || 0
  const canDrop = effectiveAmount > 0 && effectiveAmount <= coins

  const handleDrop = () => {
    if (canDrop) {
      onDrop(effectiveAmount)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
        <div className="max-w-[375px] mx-auto bg-card rounded-t-3xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-bold text-foreground">후원하기 — Drop</h2>
            <button
              onClick={onClose}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="닫기"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Artist info */}
          <div className="p-4 flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted">
              <Image
                src={artist.profileImage}
                alt={artist.artistName}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">{artist.artistName}</p>
              <p className="text-sm text-muted-foreground">{artist.artistId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">달성률</p>
              <p className="font-bold text-primary">{artist.fundingProgress}%</p>
            </div>
          </div>

          {/* Amount selection */}
          <div className="px-4 pb-4">
            <p className="text-sm text-muted-foreground mb-3">후원 금액 선택</p>
            <div className="grid grid-cols-4 gap-2">
              {amounts.map((amount) => (
                <button
                  key={amount.value}
                  onClick={() => {
                    setSelectedAmount(amount.value)
                    setIsCustom(false)
                    setCustomAmount("")
                  }}
                  className={cn(
                    "h-12 rounded-xl font-semibold text-sm transition-all",
                    selectedAmount === amount.value && !isCustom
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  )}
                >
                  {amount.label}
                </button>
              ))}
              <button
                onClick={() => {
                  setIsCustom(true)
                  setSelectedAmount(null)
                }}
                className={cn(
                  "h-12 rounded-xl font-semibold text-sm transition-all",
                  isCustom
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                )}
              >
                직접입력
              </button>
            </div>

            {/* Custom amount input */}
            {isCustom && (
              <div className="mt-3">
                <div className="relative">
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="금액 입력"
                    className="w-full h-12 px-4 pr-12 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    autoFocus
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                    C
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Balance and Drop button */}
          <div className="p-4 bg-muted/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">보유 코인</span>
              <span className="font-semibold text-foreground">{coins.toLocaleString()} C</span>
            </div>

            {effectiveAmount > coins && (
              <p className="text-sm text-destructive">보유 코인이 부족합니다</p>
            )}

            <button
              onClick={handleDrop}
              disabled={!canDrop}
              className={cn(
                "w-full h-14 rounded-full font-bold text-lg transition-all",
                canDrop
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
  )
}
