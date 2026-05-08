import { Reel, Category, CATEGORY_OPTIONS } from "./mock-data"

export function getRecommendedReels(preferences: Category[], allReels: Reel[]): Reel[] {
  if (preferences.length === 0) {
    return [...allReels].sort((a, b) => b.fundingProgress - a.fundingProgress)
  }

  const scored = allReels.map((reel) => {
    let score = 0

    if (preferences.includes(reel.category)) {
      score += 3
    } else {
      score += 1
    }

    if (reel.fundingProgress >= 70) {
      score += 2
    } else if (reel.fundingProgress >= 50) {
      score += 1
    }

    return { reel, score }
  })

  const preferred = scored
    .filter(({ reel }) => preferences.includes(reel.category))
    .sort((a, b) => b.score - a.score)
    .map(({ reel }) => reel)

  const nonPreferred = scored
    .filter(({ reel }) => !preferences.includes(reel.category))
    .sort((a, b) => b.score - a.score)
    .map(({ reel }) => reel)

  return [...preferred, ...nonPreferred]
}

export function getPreferenceLabel(preferences: Category[]): string {
  if (preferences.length === 0) return "인기순 추천"

  const labels = preferences.map((pref) => {
    const option = CATEGORY_OPTIONS.find((o) => o.id === pref)
    return option ? option.label : pref
  })

  return `${labels.join(", ")} 기반 추천`
}
