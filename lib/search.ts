import { Reel, CATEGORY_OPTIONS } from "./mock-data"

export function searchReels(query: string, allReels: Reel[]): Reel[] {
  if (!query.trim()) return allReels

  const q = query.trim().toLowerCase()

  const scored = allReels.map((reel) => {
    let score = 0

    if (reel.title.toLowerCase().includes(q)) score += 3
    if (reel.artist.name.toLowerCase().includes(q)) score += 2
    if (reel.artist.handle.toLowerCase().includes(q)) score += 2

    const categoryLabel = CATEGORY_OPTIONS.find((o) => o.id === reel.category)?.label ?? ""
    if (categoryLabel.includes(q)) score += 2

    if (reel.tags.some((tag) => tag.toLowerCase().includes(q))) score += 1
    if (reel.description.toLowerCase().includes(q)) score += 1

    return { reel, score }
  })

  return scored
    .filter(({ score }) => score >= 1)
    .sort((a, b) => b.score - a.score)
    .map(({ reel }) => reel)
}
