"use client"

import { Suspense, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { FeedScreen } from "@/components/art-drop/feed-screen"
import { ArtistProfileScreen } from "@/components/art-drop/artist-profile-screen"
import { DMChatScreen } from "@/components/art-drop/dm-chat-screen"
import { BottomNav } from "@/components/art-drop/bottom-nav"

type Tab = "home" | "feed" | "subscription" | "my"

function FeedContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const raw = searchParams.get("index")
  const initialIndex = raw !== null && !isNaN(Number(raw)) ? Number(raw) : 0

  const [artistId, setArtistId] = useState<string | null>(null)
  const [dmArtistId, setDmArtistId] = useState<string | null>(null)

  const handleTabChange = (tab: Tab) => {
    router.push("/")
  }

  if (dmArtistId) {
    return (
      <DMChatScreen artistId={dmArtistId} onBack={() => setDmArtistId(null)} />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[375px] mx-auto relative min-h-screen shadow-2xl shadow-black/50">
        {artistId ? (
          <ArtistProfileScreen
            artistId={artistId}
            onBack={() => setArtistId(null)}
            onOpenDM={(id) => setDmArtistId(id)}
          />
        ) : (
          <FeedScreen
            initialIndex={initialIndex}
            onArtistClick={(id) => setArtistId(id)}
            onOpenDM={(id) => setDmArtistId(id)}
          />
        )}

        {!artistId && (
          <BottomNav activeTab="feed" onTabChange={handleTabChange} />
        )}
      </div>
    </div>
  )
}

export default function FeedPage() {
  return (
    <Suspense>
      <FeedContent />
    </Suspense>
  )
}
