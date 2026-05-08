"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CATEGORY_OPTIONS, type Category } from "@/lib/mock-data"

export default function OnboardingPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<Category[]>([])

  const toggle = (id: Category) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  const handleStart = () => {
    if (selected.length === 0) return
    localStorage.setItem("art-drop-preferences", JSON.stringify(selected))
    router.push("/")
  }

  return (
    <div
      style={{ backgroundColor: "#0A0A0A" }}
      className="min-h-screen flex flex-col max-w-[375px] mx-auto px-5"
    >
      {/* Header */}
      <div className="pt-16 pb-8 text-center">
        <p className="text-2xl font-extrabold tracking-tight" style={{ color: "#7C3AED" }}>
          Art-Drop
        </p>
        <h1 className="mt-6 text-2xl font-bold text-white leading-snug">
          어떤 예술을 좋아하세요?
        </h1>
        <p className="mt-2 text-sm" style={{ color: "#A1A1AA" }}>
          관심 있는 분야를 선택해주세요
        </p>
      </div>

      {/* Category grid */}
      <div className="flex-1 grid grid-cols-2 gap-3 pb-4">
        {CATEGORY_OPTIONS.map((option) => {
          const isSelected = selected.includes(option.id as Category)
          return (
            <button
              key={option.id}
              onClick={() => toggle(option.id as Category)}
              className="relative flex flex-col items-center justify-center gap-2 py-8 transition-all"
              style={{
                backgroundColor: isSelected ? "rgba(124,58,237,0.15)" : "#1A1A1A",
                borderRadius: "12px",
                border: isSelected ? "2px solid #7C3AED" : "1px solid #2A2A2A",
              }}
            >
              {/* Check badge */}
              {isSelected && (
                <div
                  className="absolute top-2.5 right-2.5 w-5 h-5 flex items-center justify-center rounded-full"
                  style={{ backgroundColor: "#7C3AED" }}
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
              <span className="text-sm font-semibold text-white">{option.label}</span>
            </button>
          )
        })}
      </div>

      {/* Start button — fixed to bottom */}
      <div className="sticky bottom-0 py-6" style={{ backgroundColor: "#0A0A0A" }}>
        <button
          onClick={handleStart}
          disabled={selected.length === 0}
          className="w-full h-14 text-base font-bold transition-all"
          style={{
            borderRadius: "999px",
            backgroundColor: selected.length > 0 ? "#7C3AED" : "#2A2A2A",
            color: selected.length > 0 ? "#FFFFFF" : "#555555",
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
  )
}
