"use client"

import { Home, Play, Users, User } from "lucide-react"
import { cn } from "@/lib/utils"

type TabType = "home" | "feed" | "subscription" | "my"

interface BottomNavProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const tabs = [
  { id: "home" as const, icon: Home, label: "홈" },
  { id: "feed" as const, icon: Play, label: "피드" },
  { id: "subscription" as const, icon: Users, label: "구독" },
  { id: "my" as const, icon: User, label: "MY" },
]

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border safe-bottom">
      <div className="max-w-[375px] mx-auto flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
              aria-label={tab.label}
            >
              <Icon className={cn("w-6 h-6", isActive && "fill-current")} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
