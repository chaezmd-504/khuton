import { create } from "zustand"

export interface DroppedReel {
  reelId: string
  amount: number
  date: string
  certNumber: string
}

interface CoinStore {
  balance: number
  totalSpent: number
  dropCount: number
  droppedReels: DroppedReel[]
  deductCoin: (amount: number) => boolean
  addCoin: (amount: number) => void
  addDroppedReel: (reelId: string, amount: number) => void
}

export const useCoinStore = create<CoinStore>((set, get) => ({
  balance: 20000,
  totalSpent: 0,
  dropCount: 0,
  droppedReels: [],
  deductCoin: (amount) => {
    if (get().balance < amount) return false
    set((state) => ({
      balance: state.balance - amount,
      totalSpent: state.totalSpent + amount,
      dropCount: state.dropCount + 1,
    }))
    return true
  },
  addCoin: (amount) => set((state) => ({ balance: state.balance + amount })),
  addDroppedReel: (reelId, amount) => {
    const now = new Date()
    const date = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`
    const certNumber = "ART-" + Date.now().toString().slice(-6)
    set((state) => ({
      droppedReels: [...state.droppedReels, { reelId, amount, date, certNumber }],
    }))
  },
}))
