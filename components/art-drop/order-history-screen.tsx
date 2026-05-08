"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { useOrderStore, type Order } from "@/store/order-store"
import { DeliveryModal } from "./delivery-modal"
import { cn } from "@/lib/utils"

interface OrderHistoryScreenProps {
  onBack: () => void
}

const STATUS_LABEL: Record<Order["status"], { label: string; className: string }> = {
  pending:   { label: "배송 준비중", className: "bg-muted text-muted-foreground" },
  shipping:  { label: "배송중",     className: "bg-blue-500/15 text-blue-500" },
  delivered: { label: "배송 완료",  className: "bg-green-500/15 text-green-600" },
}

export function OrderHistoryScreen({ onBack }: OrderHistoryScreenProps) {
  const { orders } = useOrderStore()
  const [deliveryTarget, setDeliveryTarget] = useState<Order | null>(null)

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="max-w-[375px] mx-auto h-14 px-4 flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">주문 내역</h1>
        </div>
      </header>

      <main className="max-w-[375px] mx-auto px-4 py-4">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-4xl mb-3">🛍️</span>
            <p className="font-medium text-foreground">아직 구매한 작품이 없어요</p>
            <p className="text-sm text-muted-foreground mt-1">피드에서 상품을 구매해보세요</p>
          </div>
        ) : (
          <div className="space-y-3">
            {[...orders].reverse().map((order) => {
              const status = STATUS_LABEL[order.status]
              return (
                <div key={order.id} className="flex gap-3 p-3 rounded-2xl bg-card">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                    <Image
                      src={order.imageUrl}
                      alt={order.productName}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm line-clamp-2 leading-snug">
                      {order.productName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{order.artistName}</p>
                    <p className="text-sm font-bold mt-1" style={{ color: "#F59E0B" }}>
                      {order.price.toLocaleString()} C
                    </p>
                    <div className="flex items-center justify-between mt-1.5">
                      <p className="text-xs text-muted-foreground">{order.orderedAt}</p>
                      <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", status.className)}>
                        {status.label}
                      </span>
                    </div>
                    {!order.deliveryInfo && (
                      <button
                        onClick={() => setDeliveryTarget(order)}
                        className="mt-2 text-xs text-primary font-semibold underline underline-offset-2"
                      >
                        배송 정보 입력하기
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {deliveryTarget && (
        <DeliveryModal
          orderId={deliveryTarget.id}
          productName={deliveryTarget.productName}
          artistName={deliveryTarget.artistName}
          onClose={() => setDeliveryTarget(null)}
        />
      )}
    </div>
  )
}
