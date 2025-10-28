"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useScore } from "@/hooks/use-score"
import { Play, Pause, RotateCcw } from "lucide-react"

const widthMM = 480
const heightMM = 270
const paddleWidth = 12
const paddleHeight = 80
const ballSize = 20

function PongAnimation({
  player1Score,
  player2Score,
  isGameActive,
}: {
  player1Score: number
  player2Score: number
  isGameActive: boolean
}) {
  const [ballPos, setBallPos] = useState({ x: widthMM / 2, y: heightMM / 2 })
  const [ballDir, setBallDir] = useState({ x: 4, y: 4 })
  const [paddle1Y, setPaddle1Y] = useState(heightMM / 2 - paddleHeight / 2) // Left paddle vertical pos
  const [paddle2Y, setPaddle2Y] = useState(heightMM / 2 - paddleHeight / 2) // Right paddle vertical pos
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isGameActive) return

    function animate() {
  setBallPos((pos) => {
    let newX = pos.x + ballDir.x / 2  // slow down by 4x
    let newY = pos.y + ballDir.y / 2
    let newDirX = ballDir.x
    let newDirY = ballDir.y

    // Bounce off top/bottom walls
    if (newY <= 0 || newY + ballSize >= heightMM) {
      newDirY = -newDirY
      newY = Math.min(Math.max(newY, 0), heightMM - ballSize)
    }

    // Bounce off left paddle
    if (
      newX <= paddleWidth && // near left paddle x bound
      newY + ballSize >= paddle1Y &&
      newY <= paddle1Y + paddleHeight
    ) {
      newDirX = -newDirX
      newX = paddleWidth
    } else if (newX <= 0) {
      // Hit left wall without paddle
      newDirX = -newDirX
      newX = 0
    }

    // Bounce off right paddle
    if (
      newX + ballSize >= widthMM - paddleWidth && // near right paddle x bound
      newY + ballSize >= paddle2Y &&
      newY <= paddle2Y + paddleHeight
    ) {
      newDirX = -newDirX
      newX = widthMM - paddleWidth - ballSize
    } else if (newX + ballSize >= widthMM) {
      // Hit right wall without paddle
      newDirX = -newDirX
      newX = widthMM - ballSize
    }

    setBallDir({ x: newDirX, y: newDirY })
    return { x: newX, y: newY }
  })

  // Slow down paddle movements to 1/4 speed
  setPaddle1Y((y) =>
    y + 3 / 4 > heightMM - paddleHeight ? 0 : y + 3 / 4,
  )
  setPaddle2Y((y) =>
    y - 4 / 4 < 0 ? heightMM - paddleHeight : y - 4 / 4,
  )

  animationRef.current = requestAnimationFrame(animate)
}


    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [ballDir, isGameActive])

  return (
    <div
      style={{
        width: widthMM,
        height: heightMM,
        border: "3px solid cyan",
        background: "black",
        position: "relative",
        margin: "auto",
        borderRadius: 10,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Middle dashed horizontal line */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: 4,
          marginTop: -2,
          borderTop: "3px dashed rgba(255,255,255,0.3)",
          zIndex: 1,
        }}
      />

      {/* Boundary lines */}
      {/* Top line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          backgroundColor: "cyan",
          opacity: 0.5,
          zIndex: 2,
        }}
      />
      {/* Bottom line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          backgroundColor: "cyan",
          opacity: 0.5,
          zIndex: 2,
        }}
      />
      {/* Left line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: 3,
          backgroundColor: "cyan",
          opacity: 0.5,
          zIndex: 2,
        }}
      />
      {/* Right line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          width: 3,
          backgroundColor: "cyan",
          opacity: 0.5,
          zIndex: 2,
        }}
      />

      {/* Ball */}
      <div
        style={{
          width: ballSize,
          height: ballSize,
          background: "white",
          borderRadius: "50%",
          position: "absolute",
          left: ballPos.x,
          top: ballPos.y,
          zIndex: 3,
        }}
      ></div>

      {/* Left Paddle (Player 1) */}
      <div
        style={{
          width: paddleWidth,
          height: paddleHeight,
          background: "cyan",
          position: "absolute",
          left: 0,
          top: paddle1Y,
          borderRadius: 5,
          zIndex: 3,
        }}
      ></div>

      {/* Right Paddle (Player 2) */}
      <div
        style={{
          width: paddleWidth,
          height: paddleHeight,
          background: "purple",
          position: "absolute",
          right: 0,
          top: paddle2Y,
          borderRadius: 5,
          zIndex: 3,
        }}
      ></div>

      {/* Scores */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          color: "cyan",
          fontWeight: "bold",
          fontSize: 20,
          userSelect: "none",
          zIndex: 5,
          textShadow: "0 0 6px cyan",
        }}
      >
        Player 1: {player1Score}
      </div>
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          color: "purple",
          fontWeight: "bold",
          fontSize: 20,
          userSelect: "none",
          zIndex: 5,
          textShadow: "0 0 6px purple",
        }}
      >
        Player 2: {player2Score}
      </div>
    </div>
  )
}



export default function GamePlayPage() {
  const [gameSettings, setGameSettings] = useState<{
    mode: string
    level: string
    user: any
  } | null>(null)

  const router = useRouter()
  const {
    player1Score,
    player2Score,
    timeRemaining,
    isGameActive,
    startGame,
    stopGame,
    resetGame,
  } = useScore()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    const mode = localStorage.getItem("gameMode")
    const level = localStorage.getItem("gameLevel")

    if (!userData || !mode || !level) {
      router.push("/auth/login")
      return
    }

    setGameSettings({
      user: JSON.parse(userData),
      mode,
      level,
    })
  }, [router])

  useEffect(() => {
    if (timeRemaining === 0 && !isGameActive && gameSettings) {
      const gameResult = {
        player1Score,
        player2Score,
        mode: gameSettings.mode,
        level: gameSettings.level,
        winner:
          player1Score > player2Score
            ? "Player 1"
            : player2Score > player1Score
            ? "Player 2"
            : "Tie",
        timestamp: new Date().toISOString(),
      }

      const history = JSON.parse(localStorage.getItem("gameHistory") || "[]")
      history.push(gameResult)
      localStorage.setItem("lastGameResult", JSON.stringify(gameResult))
      localStorage.setItem("gameHistory", JSON.stringify(history))

      router.push("/game/winner")
    }
  }, [timeRemaining, isGameActive, player1Score, player2Score, gameSettings, router])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!gameSettings) return null

  return (
    <div className="min-h-screen relative overflow-hidden pt-14">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/bgimg2.png"
          alt="Background Mesh"
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Game Info Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="text-cyan-400">PONG</span> Arena
          </h1>
          <p className="text-gray-300">
            {gameSettings.mode === "single"
              ? "Single Player"
              : "Dual Player"}{" "}
            •{" "}
            {gameSettings.level.charAt(0).toUpperCase() +
              gameSettings.level.slice(1)}{" "}
            Mode
          </p>
        </div>

        {/* Scoreboard */}
        <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.1)] max-w-4xl mx-auto mb-8">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl text-white">Live Scoreboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-8 items-center">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {gameSettings.mode === "single"
                    ? gameSettings.user.username
                    : "Player 1"}
                </h3>
                <div className="text-6xl font-bold text-cyan-400">
                  {player1Score}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {formatTime(timeRemaining)}
                </div>
                <div
                  className={`text-sm ${
                    timeRemaining <= 10 ? "text-red-400" : "text-gray-400"
                  }`}
                >
                  Time Remaining
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {gameSettings.mode === "single" ? "AI" : "Player 2"}
                </h3>
                <div className="text-6xl font-bold text-purple-400">
                  {player2Score}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Controls */}
        <div className="flex justify-center space-x-4 mb-8">
          {!isGameActive ? (
            <Button
              onClick={startGame}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3"
            >
              <Play size={20} className="mr-2" />
              Start Game
            </Button>
          ) : (
            <Button
              onClick={stopGame}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3"
            >
              <Pause size={20} className="mr-2" />
              Pause Game
            </Button>
          )}

          <Button
            onClick={resetGame}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-3"
          >
            <RotateCcw size={20} className="mr-2" />
            Reset
          </Button>
        </div>

        {/* Game Visualization */}
        <Card className="backdrop-blur-md bg-black/30 border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.05)] max-w-4xl mx-auto">
          <CardContent className="p-8 flex justify-center">
            {/* Insert Pong animation here */}
            <PongAnimation
              player1Score={player1Score}
              player2Score={player2Score}
              isGameActive={isGameActive}
            />
          </CardContent>
        </Card>

        {/* Game Status */}
        <div className="text-center mt-8">
          <div
            className={`inline-flex items-center px-4 py-2 rounded-full ${
              isGameActive
                ? "bg-green-500/20 text-green-400 border border-green-500/50"
                : "bg-gray-500/20 text-gray-400 border border-gray-500/50"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                isGameActive ? "bg-green-400" : "bg-gray-400"
              }`}
            />
            {isGameActive ? "Game Active" : "Game Paused"}
          </div>
        </div>
      </div>
    </div>
  )
}
