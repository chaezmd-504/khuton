export interface Badge {
  id: string
  emoji: string
  name: string
  desc: string
  hint: string
}

export const ALL_BADGES: Badge[] = [
  // 가입
  { id: "member",      emoji: "✨", name: "멤버",        desc: "Art-Drop 가입 완료",        hint: "회원가입 시 획득" },
  // 후원
  { id: "first_drop",  emoji: "💧", name: "첫 Drop",     desc: "처음으로 작품 후원",         hint: "작품 1회 후원" },
  { id: "passionate",  emoji: "🔥", name: "열정 후원자",  desc: "5번 이상 후원",             hint: "후원 5회 달성" },
  { id: "maecenas",    emoji: "💎", name: "메세나",       desc: "1만C 이상 누적 후원",        hint: "누적 10,000C 후원" },
  { id: "art_partner", emoji: "👑", name: "아트 파트너",  desc: "3만C 이상 누적 후원",        hint: "누적 30,000C 후원" },
  // 수집
  { id: "collector",   emoji: "🖼️", name: "수집가",       desc: "3개 이상 작품 보관",        hint: "아카이브 3개 달성" },
  { id: "curator",     emoji: "🏛️", name: "큐레이터",     desc: "10개 이상 작품 보관",       hint: "아카이브 10개 달성" },
  // 구매
  { id: "first_buy",   emoji: "🛍️", name: "첫 구매",     desc: "처음으로 상품 구매",         hint: "상품 1회 구매" },
  { id: "shopper",     emoji: "🎁", name: "쇼핑 마니아", desc: "5개 이상 상품 구매",          hint: "구매 5회 달성" },
  // 구독
  { id: "fan",         emoji: "🌱", name: "아트 팬",      desc: "아티스트 첫 구독",          hint: "아티스트 1명 구독" },
  { id: "superfan",    emoji: "🌟", name: "슈퍼팬",       desc: "5명 이상 아티스트 구독",    hint: "구독 5명 달성" },
]

export interface BadgeInput {
  isLoggedIn: boolean
  dropCount: number
  totalSpent: number
  archivedCount: number
  orderCount: number
  subscribedCount: number
}

export function getEarnedBadgeIds(input: BadgeInput): Set<string> {
  const earned = new Set<string>()
  const { isLoggedIn, dropCount, totalSpent, archivedCount, orderCount, subscribedCount } = input

  if (isLoggedIn)          earned.add("member")
  if (dropCount >= 1)      earned.add("first_drop")
  if (dropCount >= 5)      earned.add("passionate")
  if (totalSpent >= 10000) earned.add("maecenas")
  if (totalSpent >= 30000) earned.add("art_partner")
  if (archivedCount >= 3)  earned.add("collector")
  if (archivedCount >= 10) earned.add("curator")
  if (orderCount >= 1)     earned.add("first_buy")
  if (orderCount >= 5)     earned.add("shopper")
  if (subscribedCount >= 1) earned.add("fan")
  if (subscribedCount >= 5) earned.add("superfan")

  return earned
}
