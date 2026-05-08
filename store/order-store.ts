import { create } from "zustand"

export interface Order {
  id: string
  productId: string
  reelId: string
  productName: string
  artistName: string
  price: number
  imageUrl: string
  status: "pending" | "shipping" | "delivered"
  orderedAt: string
  deliveryInfo?: {
    name: string
    phone: string
    address: string
    memo: string
  }
}

interface OrderStore {
  orders: Order[]
  addOrder: (order: Omit<Order, "id" | "orderedAt" | "status">) => string
  updateDelivery: (orderId: string, info: NonNullable<Order["deliveryInfo"]>) => void
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  addOrder: (orderData) => {
    const id = "ORD-" + Date.now()
    const orderedAt = new Date().toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
    const newOrder: Order = { ...orderData, id, orderedAt, status: "shipping" }
    set((state) => ({ orders: [...state.orders, newOrder] }))
    return id
  },
  updateDelivery: (orderId, info) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, deliveryInfo: info } : o
      ),
    })),
}))
