"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Eye, EyeOff } from "lucide-react"
import logoSrc from "@/lib/logo.png"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = () => {
    setError("")
    if (!email.trim() || !password.trim()) {
      setError("이메일과 비밀번호를 입력해주세요")
      return
    }
    if (!email.includes("@")) {
      setError("올바른 이메일 형식을 입력해주세요")
      return
    }
    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 해요")
      return
    }
    const existing = localStorage.getItem("art-drop-user")
    if (existing) {
      const user = JSON.parse(existing)
      if (user.email !== email) {
        setError("등록된 이메일이 아니에요. 회원가입을 해주세요")
        return
      }
    } else {
      // 데모: 계정이 없으면 바로 생성
      const name = email.split("@")[0]
      localStorage.setItem("art-drop-user", JSON.stringify({ name, email }))
    }
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-200 flex items-start justify-center">
      <div className="w-full max-w-[375px] min-h-screen bg-white flex flex-col px-6">
        {/* Logo */}
        <div className="flex flex-col items-center pt-20 pb-10">
          <Image src={logoSrc} alt="Art-Drop" height={44} width={180} className="h-11 w-auto object-contain" />
          <p className="mt-3 text-sm text-gray-400">예술을 후원하는 새로운 방법</p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
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
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
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

          {error && (
            <p className="text-xs text-red-500 -mt-1">{error}</p>
          )}

          <button
            onClick={handleLogin}
            className="w-full h-12 rounded-full font-bold text-sm text-white mt-2"
            style={{ background: "linear-gradient(135deg, #FFB6C1 0%, #FF85A1 100%)" }}
          >
            로그인
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400">또는</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Signup link */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            아직 계정이 없으신가요?{" "}
            <button
              onClick={() => router.push("/signup")}
              className="font-bold"
              style={{ color: "#FF85A1" }}
            >
              회원가입
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
