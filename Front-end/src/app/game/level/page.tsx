"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Target, Flame } from "lucide-react"

export default function LevelSelectionPage() {
  const [gameMode, setGameMode] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    const mode = localStorage.getItem("gameMode")

    if (!userData) {
      router.push("/auth/login")
      return
    }

    if (!mode) {
      router.push("/game/mode")
      return
    }

    setGameMode(mode)
  }, [router])

  const handleLevelSelect = (level: "easy" | "medium" | "hard") => {
    localStorage.setItem("gameLevel", level)
    router.push("/game/play")
  }

  const levels = [
    {
      id: "easy",
      name: "Easy",
      description: "Perfect for beginners",
      details: "Slower ball speed, larger paddles",
      icon: Zap,
      ringColor: "green-400",
      bgColor: "bg-green-500/20",
      hoverBg: "hover:bg-green-500/30",
      button: "bg-green-500 hover:bg-green-600",
    },
    {
      id: "medium",
      name: "Medium",
      description: "Balanced challenge",
      details: "Normal speed, standard paddles",
      icon: Target,
      ringColor: "yellow-400",
      bgColor: "bg-yellow-500/20",
      hoverBg: "hover:bg-yellow-500/30",
      button: "bg-yellow-500 hover:bg-yellow-600",
    },
    {
      id: "hard",
      name: "Hard",
      description: "For experienced players",
      details: "Fast ball, smaller paddles",
      icon: Flame,
      ringColor: "red-400",
      bgColor: "bg-red-500/20",
      hoverBg: "hover:bg-red-500/30",
      button: "bg-red-500 hover:bg-red-600",
    },
  ]

  if (!gameMode) return null

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/bgimg2.png"
          alt="Background Mesh"
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-12 pt-10">
          <h1 className="text-5xl font-bold text-white mb-4">
            Select <span className="text-cyan-400">Difficulty</span>
          </h1>
          <p className="text-xl text-gray-300">
            Choose your challenge level for {gameMode === "single" ? "Single Player" : "Dual Player"} mode
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {levels.map((level) => {
            const IconComponent = level.icon
            return (
              <Card
                key={level.id}
                onClick={() => handleLevelSelect(level.id as "easy" | "medium" | "hard")}
                className={`cursor-pointer group backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-300`}
              >
                <CardHeader className="text-center pb-6">
                  <div
                    className={`mx-auto mb-4 p-4 rounded-full ${level.bgColor} w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform ${level.hoverBg}`}
                  >
                    <IconComponent size={40} className={`text-${level.ringColor}`} />
                  </div>
                  <CardTitle className="text-3xl font-bold text-white">{level.name}</CardTitle>
                  <CardDescription className="text-gray-300 text-lg">{level.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-400 mb-6">{level.details}</p>
                  <Button
                    className={`w-full ${level.button} text-white font-semibold text-lg py-6`}
                    onClick={() => handleLevelSelect(level.id as "easy" | "medium" | "hard")}
                  >
                    Play {level.name}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            onClick={() => router.push("/game/mode")}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Back to Mode Selection
          </Button>
        </div>
      </div>
    </div>
  )
}
