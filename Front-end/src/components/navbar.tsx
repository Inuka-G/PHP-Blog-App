"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Home, Trophy } from "lucide-react"

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  // Don't show navbar on auth pages
  if (pathname.startsWith("/auth")) {
    return null
  }

  const handleSignOut = () => {
    localStorage.removeItem("user")
    router.push("/auth/login")
  }

  return (
    <nav className="w-full fixed top-0 z-50 backdrop-blur-md bg-white/10 border-white/20 shadow-2xl border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/game/mode" className="text-2xl font-bold text-white">
              RETRO <span className="text-cyan-400">CLASH</span>
            </Link>

            <div className="hidden md:flex space-x-6">
              <Link
                href="/game/mode"
                className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 transition-colors"
              >
                <Home size={18} />
                <span>Home</span>
              </Link>
              <Link
                href="/leaderboard"
                className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 transition-colors"
              >
                <Trophy size={18} />
                <span>Leaderboard</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-gray-300">
                Welcome, <span className="text-cyan-400">{user.username}</span>
              </span>
            )}
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-red-500/20 hover:border-red-500/50 hover:text-white"
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
