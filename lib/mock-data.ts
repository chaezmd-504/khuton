export type Category =
  | "painting"
  | "sculpture"
  | "photography"
  | "illustration"
  | "ceramics"
  | "installation"

export interface Artist {
  id: string
  name: string
  handle: string
  avatarUrl: string
  bio: string
  followers: number
}

export interface Reel {
  id: string
  artist: Artist
  title: string
  description: string
  category: Category
  tags: string[]
  videoId: string
  thumbnailUrl: string
  fundingProgress: number
  fundingGoal: number
  totalFunded: number
  duration: string
  createdAt: string
}

export const CATEGORY_OPTIONS = [
  { id: "painting",     label: "회화",     emoji: "🎨" },
  { id: "sculpture",    label: "조각",     emoji: "🗿" },
  { id: "photography",  label: "사진",     emoji: "📷" },
  { id: "illustration", label: "일러스트", emoji: "✏️" },
  { id: "ceramics",     label: "도예",     emoji: "🏺" },
  { id: "installation", label: "설치미술", emoji: "🖼️" },
] as const

export const ARTISTS: Artist[] = [
  {
    id: "a1",
    name: "김민준",
    handle: "@minjun_art",
    avatarUrl: "https://i.pravatar.cc/150?img=1",
    bio: "수채화로 도시의 일상을 담는 작가입니다. 서울의 골목길과 사람들의 이야기를 색채로 기록합니다.",
    followers: 12400,
  },
  {
    id: "a2",
    name: "이소연",
    handle: "@soyeon.sculpture",
    avatarUrl: "https://i.pravatar.cc/150?img=2",
    bio: "금속과 나무를 조각해 현대인의 고독을 표현합니다. 손끝에서 탄생하는 형태들이 저의 언어입니다.",
    followers: 8700,
  },
  {
    id: "a3",
    name: "박지훈",
    handle: "@jihoon.lens",
    avatarUrl: "https://i.pravatar.cc/150?img=3",
    bio: "필름 카메라로 사라져가는 순간들을 포착합니다. 빛과 그림자 사이에서 진실을 찾습니다.",
    followers: 21300,
  },
  {
    id: "a4",
    name: "최아라",
    handle: "@ara.illust",
    avatarUrl: "https://i.pravatar.cc/150?img=4",
    bio: "따뜻한 색감의 일러스트로 일상 속 작은 감동을 그립니다. 동화 같은 세계를 함께 만들어가요.",
    followers: 35600,
  },
  {
    id: "a5",
    name: "정지원",
    handle: "@jiwon.ceramic",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
    bio: "흙으로 빚는 새벽의 고요함. 손끝에서 탄생하는 그릇 하나하나에 이야기를 담습니다.",
    followers: 6800,
  },
  {
    id: "a6",
    name: "윤하늘",
    handle: "@haneul.install",
    avatarUrl: "https://i.pravatar.cc/150?img=6",
    bio: "공간 자체를 캔버스로 삼아 빛과 소리, 물질이 어우러지는 설치 작품을 만듭니다.",
    followers: 9200,
  },
]

export const REELS: Reel[] = [
  {
    id: "r1",
    artist: ARTISTS[0],
    title: "봄의 잔상 #3",
    description: "벚꽃이 지는 순간의 아름다움을 수채화로 담았습니다. 투명한 레이어링 기법으로 빛과 그림자를 표현했어요.",
    category: "painting",
    tags: ["수채화", "봄", "벚꽃", "풍경화"],
    videoId: "dQw4w9WgXcQ",
    thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    fundingProgress: 82,
    fundingGoal: 500000,
    totalFunded: 410000,
    duration: "0:38",
    createdAt: "2024-03-15",
  },
  {
    id: "r2",
    artist: ARTISTS[0],
    title: "기억의 색채 연구",
    description: "어릴 적 할머니 댁의 따뜻한 노란빛, 첫사랑의 분홍빛 설렘... 기억 속 색채를 캔버스에 풀어냈습니다.",
    category: "painting",
    tags: ["유화", "추상화", "색채연구", "기억"],
    videoId: "MC_OBgFhMcY",
    thumbnailUrl: "https://img.youtube.com/vi/MC_OBgFhMcY/maxresdefault.jpg",
    fundingProgress: 55,
    fundingGoal: 300000,
    totalFunded: 165000,
    duration: "0:52",
    createdAt: "2024-03-10",
  },
  {
    id: "r3",
    artist: ARTISTS[1],
    title: "도시의 무게",
    description: "고철과 폐목으로 만든 현대인의 초상. 무거운 삶을 짊어진 형태들이 서로를 지탱합니다.",
    category: "sculpture",
    tags: ["조각", "철", "현대조각", "설치"],
    videoId: "jNQXAC9IVRw",
    thumbnailUrl: "https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg",
    fundingProgress: 67,
    fundingGoal: 800000,
    totalFunded: 536000,
    duration: "1:05",
    createdAt: "2024-03-08",
  },
  {
    id: "r4",
    artist: ARTISTS[1],
    title: "균열 : 내면의 지형도",
    description: "갈라진 대리석 속에서 피어나는 새로운 형태. 상처를 통해 드러나는 아름다움을 조각했습니다.",
    category: "sculpture",
    tags: ["대리석", "조각", "현대미술", "치유"],
    videoId: "9bZkp7q19f0",
    thumbnailUrl: "https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg",
    fundingProgress: 40,
    fundingGoal: 1200000,
    totalFunded: 480000,
    duration: "0:47",
    createdAt: "2024-03-01",
  },
  {
    id: "r5",
    artist: ARTISTS[2],
    title: "새벽 세 시의 서울",
    description: "아무도 없는 도시의 새벽. 필름 카메라로 담은 고요한 서울의 이면입니다.",
    category: "photography",
    tags: ["필름사진", "서울", "새벽", "흑백"],
    videoId: "aqz-KE-bpKQ",
    thumbnailUrl: "https://img.youtube.com/vi/aqz-KE-bpKQ/maxresdefault.jpg",
    fundingProgress: 88,
    fundingGoal: 200000,
    totalFunded: 176000,
    duration: "0:33",
    createdAt: "2024-02-28",
  },
  {
    id: "r6",
    artist: ARTISTS[2],
    title: "사라지는 것들에 대하여",
    description: "재개발 전 골목길 풍경들. 곧 사라질 공간들을 기록으로 남겼습니다.",
    category: "photography",
    tags: ["다큐멘터리", "골목길", "기록사진", "재개발"],
    videoId: "kJQP7kiw5Fk",
    thumbnailUrl: "https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg",
    fundingProgress: 73,
    fundingGoal: 400000,
    totalFunded: 292000,
    duration: "0:58",
    createdAt: "2024-02-20",
  },
  {
    id: "r7",
    artist: ARTISTS[3],
    title: "작은 행성의 하루",
    description: "작은 별에 사는 주민들의 일상. 따뜻한 색연필로 그린 동화 같은 세계입니다.",
    category: "illustration",
    tags: ["일러스트", "색연필", "동화", "캐릭터"],
    videoId: "RgKAFK5djSk",
    thumbnailUrl: "https://img.youtube.com/vi/RgKAFK5djSk/maxresdefault.jpg",
    fundingProgress: 91,
    fundingGoal: 150000,
    totalFunded: 136500,
    duration: "0:42",
    createdAt: "2024-02-15",
  },
  {
    id: "r8",
    artist: ARTISTS[3],
    title: "계절을 먹는 소녀",
    description: "봄꽃, 여름 수박, 가을 단풍, 겨울 눈사탕... 계절의 맛을 담은 일러스트 시리즈입니다.",
    category: "illustration",
    tags: ["일러스트", "계절", "음식", "시리즈"],
    videoId: "OPf0YbXqDm0",
    thumbnailUrl: "https://img.youtube.com/vi/OPf0YbXqDm0/maxresdefault.jpg",
    fundingProgress: 34,
    fundingGoal: 250000,
    totalFunded: 85000,
    duration: "0:29",
    createdAt: "2024-02-10",
  },
  {
    id: "r9",
    artist: ARTISTS[4],
    title: "달항아리 : 여백의 미",
    description: "조선 백자의 여백에서 영감받은 현대 도예. 단순함 속에 깃든 깊이를 담았습니다.",
    category: "ceramics",
    tags: ["도예", "백자", "전통", "현대도예"],
    videoId: "pRpeEdMmmQ0",
    thumbnailUrl: "https://img.youtube.com/vi/pRpeEdMmmQ0/maxresdefault.jpg",
    fundingProgress: 61,
    fundingGoal: 600000,
    totalFunded: 366000,
    duration: "1:12",
    createdAt: "2024-02-05",
  },
  {
    id: "r10",
    artist: ARTISTS[4],
    title: "점토로 빚는 새벽",
    description: "새벽 4시, 고요한 작업실에서 흙을 빚습니다. 아무도 없는 시간의 평온함을 그릇에 담았어요.",
    category: "ceramics",
    tags: ["도예", "점토", "새벽작업", "과정"],
    videoId: "fJ9rUzIMcZQ",
    thumbnailUrl: "https://img.youtube.com/vi/fJ9rUzIMcZQ/maxresdefault.jpg",
    fundingProgress: 47,
    fundingGoal: 450000,
    totalFunded: 211500,
    duration: "0:55",
    createdAt: "2024-01-30",
  },
  {
    id: "r11",
    artist: ARTISTS[5],
    title: "소리의 형태",
    description: "음파를 시각화한 설치 작품. 관람객의 목소리가 공간을 변형시킵니다.",
    category: "installation",
    tags: ["설치미술", "인터랙티브", "소리", "공간"],
    videoId: "60ItHLz5WEA",
    thumbnailUrl: "https://img.youtube.com/vi/60ItHLz5WEA/maxresdefault.jpg",
    fundingProgress: 78,
    fundingGoal: 2000000,
    totalFunded: 1560000,
    duration: "1:30",
    createdAt: "2024-01-25",
  },
  {
    id: "r12",
    artist: ARTISTS[5],
    title: "빛의 방",
    description: "수천 개의 거울 조각으로 만든 몰입형 설치. 당신이 들어서는 순간 공간이 달라집니다.",
    category: "installation",
    tags: ["설치미술", "빛", "거울", "몰입형"],
    videoId: "Ct6BUPvE2sM",
    thumbnailUrl: "https://img.youtube.com/vi/Ct6BUPvE2sM/maxresdefault.jpg",
    fundingProgress: 30,
    fundingGoal: 3000000,
    totalFunded: 900000,
    duration: "2:10",
    createdAt: "2024-01-20",
  },
]
