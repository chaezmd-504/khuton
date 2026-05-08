"use client"

import { useState } from "react"
import { X, CreditCard, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface CoinChargeSheetProps {
  currentCoins: number
  onClose: () => void
  onCharge: (amount: number) => void
}

const packages = [
  { coins: 1000, price: 1100, label: "1,000C", priceLabel: "₩1,100" },
  { coins: 5000, price: 5000, label: "5,000C", priceLabel: "₩5,000" },
  { coins: 10000, price: 9500, label: "10,000C", priceLabel: "₩9,500", badge: "인기" },
  { coins: 50000, price: 45000, label: "50,000C", priceLabel: "₩45,000", badge: "10% 할인" },
]

const paymentMethods = [
  { id: "kakao", label: "카카오페이", icon: "🟡" },
  { id: "card", label: "신용카드", icon: CreditCard },
  { id: "bank", label: "계좌이체", icon: Building2 },
]

export function CoinChargeSheet({ currentCoins, onClose, onCharge }: CoinChargeSheetProps) {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)
  const [selectedPayment, setSelectedPayment] = useState<string | null>("kakao")

  const canCharge = selectedPackage !== null && selectedPayment !== null

  const handleCharge = () => {
    if (canCharge && selectedPackage !== null) {
      const pkg = packages.find((p) => p.coins === selectedPackage)
      if (pkg) {
        onCharge(pkg.coins)
      }
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
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up max-h-[85vh] overflow-auto">
        <div className="max-w-[375px] mx-auto bg-card rounded-t-3xl overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-card flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-bold text-foreground">코인 충전</h2>
            <button
              onClick={onClose}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="닫기"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Current balance */}
          <div className="p-4 bg-muted/30">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">현재 보유 코인</span>
              <span className="text-xl font-bold text-secondary">{currentCoins.toLocaleString()} C</span>
            </div>
          </div>

          {/* Package selection */}
          <div className="p-4">
            <p className="text-sm text-muted-foreground mb-3">충전 패키지 선택</p>
            <div className="grid grid-cols-2 gap-3">
              {packages.map((pkg) => (
                <button
                  key={pkg.coins}
                  onClick={() => setSelectedPackage(pkg.coins)}
                  className={cn(
                    "relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all",
                    selectedPackage === pkg.coins
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/50"
                  )}
                >
                  {pkg.badge && (
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-bold">
                      {pkg.badge}
                    </span>
                  )}
                  <span className="text-2xl font-bold text-foreground">{pkg.label}</span>
                  <span className="text-sm text-muted-foreground mt-1">{pkg.priceLabel}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Payment method selection */}
          <div className="p-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">결제 수단 선택</p>
            <div className="space-y-2">
              {paymentMethods.map((method) => {
                const Icon = typeof method.icon === "string" ? null : method.icon
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all",
                      selectedPayment === method.id
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-primary/50"
                    )}
                  >
                    {Icon ? (
                      <Icon className="w-6 h-6 text-muted-foreground" />
                    ) : (
                      <span className="text-2xl">{method.icon as string}</span>
                    )}
                    <span className="font-medium text-foreground">{method.label}</span>
                    {selectedPayment === method.id && (
                      <div className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3 text-primary-foreground">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Charge button */}
          <div className="p-4 bg-muted/30 safe-bottom">
            <button
              onClick={handleCharge}
              disabled={!canCharge}
              className={cn(
                "w-full h-14 rounded-full font-bold text-lg transition-all",
                canCharge
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              충전하기
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
