"use client"

import { useState } from "react"
import { BottomNav } from "@/components/art-drop/bottom-nav"
import { HomeScreen } from "@/components/art-drop/home-screen"
import { FeedScreen } from "@/components/art-drop/feed-screen"
import { SubscriptionScreen } from "@/components/art-drop/subscription-screen"
import { MyPageScreen } from "@/components/art-drop/my-page-screen"
import { ArtistProfileScreen } from "@/components/art-drop/artist-profile-screen"
import { DMChatScreen } from "@/components/art-drop/dm-chat-screen"

type TabType = "home" | "feed" | "subscription" | "my"

export default function ArtDropApp() {
  const [activeTab, setActiveTab] = useState<TabType>("home")
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null)
  const [coins, setCoins] = useState(12500)
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null)
  const [dmArtistId, setDmArtistId] = useState<string | null>(null)

  const handleVideoClick = (videoId: string) => {
    setSelectedVideoId(videoId)
    setActiveTab("feed")
  }

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    if (tab !== "feed") {
      setSelectedVideoId(null)
    }
    // Clear artist profile when changing tabs
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
    <div className="min-h-screen bg-background">
      {/* Mobile container - centered on desktop */}
      <div className="max-w-[375px] mx-auto relative min-h-screen shadow-2xl shadow-black/50">
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
              <HomeScreen onVideoClick={handleVideoClick} />
            )}
            
            {activeTab === "feed" && (
              <FeedScreen
                initialVideoId={selectedVideoId || undefined}
                coins={coins}
                onCoinsChange={setCoins}
                onArtistClick={handleArtistClick}
                onOpenDM={handleOpenDM}
              />
            )}
            
            {activeTab === "subscription" && (
              <SubscriptionScreen onArtistClick={handleArtistClick} />
            )}
            
            {activeTab === "my" && (
              <MyPageScreen
                coins={coins}
                onCoinsChange={setCoins}
              />
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
