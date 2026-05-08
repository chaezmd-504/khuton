"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useOrderStore } from "@/store/order-store"

interface DeliveryModalProps {
  orderId: string
  productName: string
  artistName: string
  onClose: () => void
}

export function DeliveryModal({ orderId, productName, artistName, onClose }: DeliveryModalProps) {
  const { updateDelivery } = useOrderStore()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [memo, setMemo] = useState("")
  const [saved, setSaved] = useState(false)

  const canSave = name.trim() && phone.trim() && address.trim()

  const handleSave = () => {
    if (!canSave) return
    updateDelivery(orderId, { name, phone, address, memo })
    setSaved(true)
    setTimeout(() => onClose(), 1200)
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-[70] flex items-end justify-center">
      <div className="w-full max-w-[375px] bg-card rounded-t-3xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border">
          <div>
            <h2 className="text-base font-bold text-foreground">배송 정보 입력</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {productName} · {artistName}
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {saved ? (
          <div className="flex flex-col items-center justify-center py-10">
            <span className="text-3xl mb-2">🚚</span>
            <p className="font-semibold text-foreground">배송 정보가 저장됐어요!</p>
          </div>
        ) : (
          <>
            <div className="px-4 py-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  받는 분 이름 <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="홍길동"
                  className="w-full h-11 px-3 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  연락처 <span className="text-destructive">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010-0000-0000"
                  className="w-full h-11 px-3 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  배송 주소 <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="서울시 강남구 테헤란로 123"
                  className="w-full h-11 px-3 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  배송 메모
                </label>
                <input
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="문 앞에 놔주세요"
                  className="w-full h-11 px-3 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="px-4 pb-8 space-y-2">
              <button
                onClick={handleSave}
                disabled={!canSave}
                className={cn(
                  "w-full h-12 rounded-full font-bold text-sm transition-all",
                  canSave
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                배송 정보 저장
              </button>
              <button
                onClick={onClose}
                className="w-full h-10 rounded-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                나중에 입력
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
