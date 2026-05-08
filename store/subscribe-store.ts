import { create } from "zustand"
import { ARTISTS } from "@/lib/mock-data"

interface SubscribeStore {
  subscribedIds: Set<string>
  toggleSubscribe: (handle: string) => void
  isSubscribed: (handle: string) => boolean
}

const initialSubscribed = new Set(ARTISTS.slice(0, 3).map((a) => a.handle))

export const useSubscribeStore = create<SubscribeStore>((set, get) => ({
  subscribedIds: initialSubscribed,
  toggleSubscribe: (handle) =>
    set((state) => {
      const next = new Set(state.subscribedIds)
      if (next.has(handle)) next.delete(handle)
      else next.add(handle)
      return { subscribedIds: next }
    }),
  isSubscribed: (handle) => get().subscribedIds.has(handle),
}))
