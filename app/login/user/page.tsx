"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar } from "lucide-react"
import styles from "../login-box.module.css"
import { cn } from "@/lib/utils"

export default function UserLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { toast } = useToast()
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const user = await login(username, password)

      if (user.role !== "user") {
        toast({
          title: "Access denied",
          description: "This login is for regular users only",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Login successful",
        description: "Welcome to the events dashboard",
      })

      router.push("/")
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4">
      <div className={styles.loginBox}>
        <div className={styles.formContent}>
          <div className="flex items-center justify-center mb-6">
            <Calendar className="mr-2 h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">User Login</h1>
          </div>

          <div className="space-y-2 text-center mb-6">
            <p className="text-sm text-muted-foreground">Enter your credentials to access the events dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={cn(styles.input, "border-primary focus-visible:ring-primary")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={cn(styles.input, "border-primary focus-visible:ring-primary")}
              />
            </div>

            <Button type="submit" className={cn(styles.button, "w-full")} disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="text-center text-sm mt-4">
            <p>Default: username: event, password: event</p>
          </div>

          <div className="flex justify-center mt-4">
            <Link href="/login" className="flex items-center text-sm text-primary hover:underline">
              <ArrowLeft className="mr-1 h-3 w-3" />
              Back to login options
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
