import { create } from "zustand"

interface CoinStore {
  balance: number
  totalSpent: number
  dropCount: number
  deductCoin: (amount: number) => boolean
  addCoin: (amount: number) => void
}

export const useCoinStore = create<CoinStore>((set, get) => ({
  balance: 12500,
  totalSpent: 0,
  dropCount: 0,
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
}))
