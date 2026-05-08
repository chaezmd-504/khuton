"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ArrowLeft, Send, ImageIcon, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  text: string
  isMine: boolean
  timestamp: string
}

interface ArtistInfo {
  artistId: string
  artistName: string
  profileImage: string
}

const mockArtistInfo: Record<string, ArtistInfo> = {
  "@minjun_art": {
    artistId: "@minjun_art",
    artistName: "민준",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  "@soyeon.draws": {
    artistId: "@soyeon.draws",
    artistName: "소연",
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
  "@leehyun_studio": {
    artistId: "@leehyun_studio",
    artistName: "이현",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
  "@park.illust": {
    artistId: "@park.illust",
    artistName: "박일러스트",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
  },
  "@jiwon.ceramic": {
    artistId: "@jiwon.ceramic",
    artistName: "지원 세라믹",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
  },
}

interface DMChatScreenProps {
  artistId: string
  onBack: () => void
}

export function DMChatScreen({ artistId, onBack }: DMChatScreenProps) {
  const artist = mockArtistInfo[artistId]
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "안녕하세요! 작품 문의드립니다 :)",
      isMine: true,
      timestamp: "오후 2:30",
    },
    {
      id: "2",
      text: "안녕하세요! 어떤 작품이 궁금하신가요?",
      isMine: false,
      timestamp: "오후 2:32",
    },
  ])
  const [inputText, setInputText] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (!inputText.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isMine: true,
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit", hour12: true }),
    }

    setMessages((prev) => [...prev, newMessage])
    setInputText("")

    // Simulate artist reply
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        text: "메시지 감사합니다! 확인 후 답변 드릴게요 :)",
        isMine: false,
        timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit", hour12: true }),
      }
      setMessages((prev) => [...prev, reply])
    }, 1500)
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">아티스트를 찾을 수 없습니다</p>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-lg border-b border-border flex-shrink-0">
        <div className="max-w-[375px] mx-auto h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 -ml-2">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted">
              <Image
                src={artist.profileImage}
                alt={artist.artistName}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">{artist.artistName}</p>
              <p className="text-xs text-muted-foreground">{artist.artistId}</p>
            </div>
          </div>
          <button className="p-2 -mr-2">
            <MoreHorizontal className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[375px] mx-auto p-4 space-y-4">
          {/* Artist info card */}
          <div className="flex flex-col items-center py-6 border-b border-border mb-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted ring-2 ring-primary/20">
              <Image
                src={artist.profileImage}
                alt={artist.artistName}
                fill
                className="object-cover"
              />
            </div>
            <p className="mt-3 font-bold text-foreground">{artist.artistName}</p>
            <p className="text-sm text-muted-foreground">{artist.artistId}</p>
            <p className="text-xs text-muted-foreground mt-2">Art-Drop 아티스트</p>
          </div>

          {/* Messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.isMine ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn("flex items-end gap-2", message.isMine && "flex-row-reverse")}>
                {!message.isMine && (
                  <div className="relative w-7 h-7 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={artist.profileImage}
                      alt={artist.artistName}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[240px] px-4 py-2.5 rounded-2xl",
                    message.isMine
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-card text-foreground rounded-bl-md"
                  )}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input area */}
      <div className="bg-background border-t border-border flex-shrink-0">
        <div className="max-w-[375px] mx-auto px-4 py-3 flex items-center gap-3">
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <ImageIcon className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="메시지 보내기..."
              className="w-full bg-card rounded-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className={cn(
              "p-2 rounded-full transition-colors",
              inputText.trim()
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
