import { create } from "zustand"

interface ArchiveStore {
  archivedIds: Set<string>
  toggleArchive: (id: string) => void
  isArchived: (id: string) => boolean
}

export const useArchiveStore = create<ArchiveStore>((set, get) => ({
  archivedIds: new Set(),
  toggleArchive: (id) =>
    set((state) => {
      const next = new Set(state.archivedIds)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return { archivedIds: next }
    }),
  isArchived: (id) => get().archivedIds.has(id),
}))
