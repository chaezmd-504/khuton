"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Eye, EyeOff, ChevronLeft } from "lucide-react"
import logoSrc from "@/lib/logo.png"
import { CATEGORY_OPTIONS, type Category } from "@/lib/mock-data"

type Step = 1 | 2

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)

  // Step 1 fields
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState("")

  // Step 2 fields
  const [selected, setSelected] = useState<Category[]>([])

  const handleStep1 = () => {
    setError("")
    if (!name.trim()) { setError("이름을 입력해주세요"); return }
    if (!email.trim() || !email.includes("@")) { setError("올바른 이메일 형식을 입력해주세요"); return }
    if (password.length < 6) { setError("비밀번호는 6자 이상이어야 해요"); return }
    setStep(2)
  }

  const toggle = (id: Category) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  const handleSignup = () => {
    if (selected.length === 0) return
    localStorage.setItem("art-drop-user", JSON.stringify({ name: name.trim(), email }))
    localStorage.setItem("art-drop-preferences", JSON.stringify(selected))
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-200 flex items-start justify-center">
      <div className="w-full max-w-[375px] min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="flex items-center px-4 pt-12 pb-4">
          <button
            onClick={() => (step === 2 ? setStep(1) : router.push("/login"))}
            className="p-2 -ml-2 text-gray-500"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 flex justify-center">
            <Image src={logoSrc} alt="Art-Drop" height={32} width={130} className="h-8 w-auto object-contain" />
          </div>
          <div className="w-10" />
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 px-6 pb-6">
          <div className="h-1 flex-1 rounded-full" style={{ backgroundColor: "#FFB6C1" }} />
          <div className="h-1 flex-1 rounded-full" style={{ backgroundColor: step === 2 ? "#FFB6C1" : "#E5E7EB" }} />
        </div>

        {step === 1 ? (
          /* ── Step 1: Basic info ── */
          <div className="flex flex-col flex-1 px-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">회원가입</h2>
            <p className="text-sm text-gray-400 mb-6">Art-Drop에 오신 걸 환영해요</p>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">이름</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleStep1()}
                  placeholder="홍길동"
                  className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">이메일</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleStep1()}
                  placeholder="example@email.com"
                  className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">비밀번호</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleStep1()}
                    placeholder="6자 이상 입력"
                    className="w-full h-12 px-4 pr-12 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && <p className="text-xs text-red-500 -mt-1">{error}</p>}

              <button
                onClick={handleStep1}
                className="w-full h-12 rounded-full font-bold text-sm mt-2"
                style={{ background: "linear-gradient(135deg, #FFB6C1 0%, #FF85A1 100%)", color: "white" }}
              >
                다음
              </button>
            </div>

            <div className="mt-auto pb-8 text-center pt-6">
              <p className="text-sm text-gray-500">
                이미 계정이 있으신가요?{" "}
                <button
                  onClick={() => router.push("/login")}
                  className="font-bold"
                  style={{ color: "#FF85A1" }}
                >
                  로그인
                </button>
              </p>
            </div>
          </div>
        ) : (
          /* ── Step 2: Preference selection ── */
          <div className="flex flex-col flex-1 px-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">어떤 예술을 좋아하세요?</h2>
            <p className="text-sm text-gray-400 mb-6">관심 있는 분야를 선택해주세요</p>

            <div className="grid grid-cols-2 gap-3 flex-1">
              {CATEGORY_OPTIONS.map((option) => {
                const isSelected = selected.includes(option.id as Category)
                return (
                  <button
                    key={option.id}
                    onClick={() => toggle(option.id as Category)}
                    className="relative flex flex-col items-center justify-center gap-2 py-8 transition-all"
                    style={{
                      backgroundColor: isSelected ? "rgba(255, 133, 161, 0.1)" : "#F9FAFB",
                      borderRadius: "12px",
                      border: isSelected ? "2px solid #FF85A1" : "1px solid #E5E7EB",
                    }}
                  >
                    {isSelected && (
                      <div
                        className="absolute top-2.5 right-2.5 w-5 h-5 flex items-center justify-center rounded-full"
                        style={{ backgroundColor: "#FF85A1" }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-3 h-3"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                    <span style={{ fontSize: "2.5rem", lineHeight: 1 }}>{option.emoji}</span>
                    <span className="text-sm font-semibold text-gray-800">{option.label}</span>
                  </button>
                )
              })}
            </div>

            <div className="sticky bottom-0 py-6 bg-white">
              <button
                onClick={handleSignup}
                disabled={selected.length === 0}
                className="w-full h-14 text-base font-bold rounded-full transition-all"
                style={{
                  background: selected.length > 0
                    ? "linear-gradient(135deg, #FFB6C1 0%, #FF85A1 100%)"
                    : "#E5E7EB",
                  color: selected.length > 0 ? "white" : "#9CA3AF",
                  cursor: selected.length > 0 ? "pointer" : "not-allowed",
                }}
              >
                시작하기
                {selected.length > 0 && (
                  <span className="ml-2 text-sm font-normal opacity-80">
                    ({selected.length}개 선택)
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
