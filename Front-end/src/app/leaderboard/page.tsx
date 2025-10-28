"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trophy, Medal, Award, Home } from "lucide-react"

export default function LeaderboardPage() {
  const [gameHistory, setGameHistory] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/login")
      return
    }
    setUser(JSON.parse(userData))

    const history = JSON.parse(localStorage.getItem("gameHistory") || "[]")

    if (history.length === 0) {
      const mockGames = [
        {
          player1Score: 15,
          player2Score: 12,
          mode: "single",
          level: "hard",
          winner: "Player 1",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          player1Score: 8,
          player2Score: 11,
          mode: "dual",
          level: "medium",
          winner: "Player 2",
          timestamp: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          player1Score: 20,
          player2Score: 18,
          mode: "single",
          level: "easy",
          winner: "Player 1",
          timestamp: new Date(Date.now() - 259200000).toISOString(),
        },
      ]
      setGameHistory(mockGames)
    } else {
      setGameHistory(history)
    }
  }, [router])

  const formatDate = (timestamp: string) =>
    new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="text-yellow-400" size={20} />
      case 1:
        return <Medal className="text-gray-400" size={20} />
      case 2:
        return <Award className="text-amber-600" size={20} />
      default:
        return <span className="text-gray-500 font-bold">#{index + 1}</span>
    }
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "easy":
        return "text-green-400"
      case "medium":
        return "text-yellow-400"
      case "hard":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const sortedGames = [...gameHistory].sort((a, b) => {
    const totalA = a.player1Score + a.player2Score
    const totalB = b.player1Score + b.player2Score
    return totalB - totalA
  })

  if (!user) return null

  return (
    <div className="min-h-screen relative overflow-hidden pt-10">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src="/bgimg2.png"
          alt="Leaderboard Background"
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            <Trophy className="inline-block mr-3 text-yellow-400" size={48} />
            <span className="text-cyan-400">Leaderboard</span>
          </h1>
          <p className="text-xl text-gray-300">Hall of Fame - Top Pong Performances</p>
        </div>

        <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.05)] max-w-6xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-white text-center">Game History & Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            {gameHistory.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="mx-auto mb-4 text-gray-400" size={64} />
                <p className="text-gray-400 text-lg">No games played yet</p>
                <p className="text-gray-500">Start playing to see your scores here!</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/20">
                    <TableHead className="text-gray-300">Rank</TableHead>
                    <TableHead className="text-gray-300">Score</TableHead>
                    <TableHead className="text-gray-300">Winner</TableHead>
                    <TableHead className="text-gray-300">Mode</TableHead>
                    <TableHead className="text-gray-300">Level</TableHead>
                    <TableHead className="text-gray-300">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedGames.map((game, index) => (
                    <TableRow key={index} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-white">
                        <div className="flex items-center space-x-2">
                          {getRankIcon(index)}
                          <span>#{index + 1}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-white font-mono">
                        <span className="text-cyan-400">{game.player1Score}</span> -{" "}
                        <span className="text-purple-400">{game.player2Score}</span>
                      </TableCell>
                      <TableCell className="text-white">
                        <span
                          className={
                            game.winner === "Player 1"
                              ? "text-cyan-400"
                              : game.winner === "Player 2"
                                ? "text-purple-400"
                                : "text-yellow-400"
                          }
                        >
                          {game.winner}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {game.mode === "single" ? "Single Player" : "Dual Player"}
                      </TableCell>
                      <TableCell className={getDifficultyColor(game.level)}>
                        {game.level.charAt(0).toUpperCase() + game.level.slice(1)}
                      </TableCell>
                      <TableCell className="text-gray-400">{formatDate(game.timestamp)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Button
            onClick={() => router.push("/game/mode")}
            className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-8 py-3"
          >
            <Home size={20} className="mr-2" />
            Back to Game
          </Button>
        </div>
      </div>
    </div>
  )
}
