"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.username ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      setLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      setLoading(false)
      return
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: formData.username,
          fullName: formData.fullName,
          email: formData.email,
        }),
      )
      router.push("/game/mode")
    } catch {
      setError("Sign up failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-black">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src="/bgimg2.png"
          alt="Background"
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      {/* Card Content */}
      <div className="relative z-10 w-full max-w-md px-6 py-12">
        <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.05)]">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-white mb-2">
              Join <span className="text-cyan-400">PONG ARENA</span>
            </CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              Create your account to start playing
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className="bg-red-500/20 border-red-500/50 text-red-200">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {[
                { id: "email", label: "Email", type: "email", placeholder: "Enter your email" },
                { id: "username", label: "Username", type: "text", placeholder: "Choose a username" },
                { id: "password", label: "Password", type: "password", placeholder: "Create a password" },
                { id: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Confirm your password" },
              ].map(({ id, label, type, placeholder }) => (
                <div key={id} className="space-y-2">
                  <Label htmlFor={id} className="text-white font-semibold">{label}</Label>
                  <Input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={(formData as any)[id]}
                    onChange={(e) => setFormData((prev) => ({ ...prev, [id]: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400"
                    required
                  />
                </div>
              ))}

              <Button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-300 text-sm">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300 font-semibold">
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
