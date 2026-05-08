"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BottomNav } from "@/components/art-drop/bottom-nav"
import { HomeScreen } from "@/components/art-drop/home-screen"
import { FeedScreen } from "@/components/art-drop/feed-screen"
import { SubscriptionScreen } from "@/components/art-drop/subscription-screen"
import { MyPageScreen } from "@/components/art-drop/my-page-screen"
import { ArtistProfileScreen } from "@/components/art-drop/artist-profile-screen"
import { DMChatScreen } from "@/components/art-drop/dm-chat-screen"

type TabType = "home" | "feed" | "subscription" | "my"

export default function ArtDropApp() {
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("art-drop-user")
    if (!user) {
      router.push("/login")
      return
    }
    const raw = localStorage.getItem("art-drop-preferences")
    if (!raw) {
      router.push("/onboarding")
      return
    }
    try {
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed) || parsed.length === 0) {
        router.push("/onboarding")
      }
    } catch {
      router.push("/onboarding")
    }
  }, [router])

  const [activeTab, setActiveTab] = useState<TabType>("home")
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null)
  const [dmArtistId, setDmArtistId] = useState<string | null>(null)

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    setSelectedArtistId(null)
  }

  const handleArtistClick = (artistId: string) => {
    setSelectedArtistId(artistId)
  }

  const handleOpenDM = (artistId: string) => {
    setDmArtistId(artistId)
  }

  const handleCloseDM = () => {
    setDmArtistId(null)
  }

  const handleBackFromArtist = () => {
    setSelectedArtistId(null)
  }

  // Show DM screen as overlay
  if (dmArtistId) {
    return <DMChatScreen artistId={dmArtistId} onBack={handleCloseDM} />
  }

  return (
    <div className="min-h-screen bg-gray-200">
      {/* Mobile container - centered on desktop */}
      <div className="max-w-[375px] mx-auto relative min-h-screen bg-background shadow-2xl shadow-black/30">
        {/* Artist profile screen overlay */}
        {selectedArtistId ? (
          <ArtistProfileScreen
            artistId={selectedArtistId}
            onBack={handleBackFromArtist}
            onOpenDM={handleOpenDM}
          />
        ) : (
          <>
            {activeTab === "home" && (
              <HomeScreen />
            )}
            
            {activeTab === "feed" && (
              <FeedScreen
                onArtistClick={handleArtistClick}
                onOpenDM={handleOpenDM}
              />
            )}
            
            {activeTab === "subscription" && (
              <SubscriptionScreen onArtistClick={handleArtistClick} />
            )}
            
            {activeTab === "my" && (
              <MyPageScreen />
            )}
          </>
        )}

        {/* Bottom navigation - hide when on artist profile */}
        {!selectedArtistId && (
          <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        )}
      </div>
    </div>
  )
}
