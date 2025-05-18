"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Calendar, ShieldCheck, User, Code2, Terminal } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import styles from "./login-box.module.css"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const { user } = useAuth()
  const router = useRouter()

  // If user is already logged in, redirect to appropriate dashboard
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/")
      }
    }
  }, [user, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1f] to-[#2a2a35]">
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-8">
        <div className="mb-12 flex items-center justify-center">
          <Code2 className="mr-3 h-12 w-12 text-[#0066ff]" />
          <div>
            <h1 className="text-4xl font-bold text-white">42 Events</h1>
            <p className="text-sm text-[#80b3ff]">Coding School Event Management</p>
          </div>
        </div>

        <div className="grid w-full max-w-4xl gap-8 md:grid-cols-2">
          <Card className={cn(styles.loginBox, "border-none bg-transparent")}>
            <CardHeader className="bg-[#1a1a1f]/80 backdrop-blur-sm">
              <CardTitle className="flex items-center text-[#0066ff]">
                <User className="mr-2 h-5 w-5" />
                Student Login
              </CardTitle>
              <CardDescription className="text-[#80b3ff]">Access the events dashboard as a student</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-6 text-sm text-[#b3d1ff]">
                Login as a student to view and interact with events. Students can browse events, export data, and receive
                notifications.
              </p>
              <Link href="/login/user">
                <Button className={cn(styles.button, "w-full")}>Login as Student</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className={cn(styles.loginBox, "border-none bg-transparent")}>
            <CardHeader className="bg-[#1a1a1f]/80 backdrop-blur-sm">
              <CardTitle className="flex items-center text-[#0066ff]">
                <ShieldCheck className="mr-2 h-5 w-5" />
                Staff Login
              </CardTitle>
              <CardDescription className="text-[#80b3ff]">Access the admin dashboard with full control</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-6 text-sm text-[#b3d1ff]">
                Login as staff to manage events, students, and system settings. Staff members have full control over the
                application.
              </p>
              <Link href="/login/admin">
                <Button className={cn(styles.button, "w-full")}>Login as Staff</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 rounded-lg bg-[#1a1a1f]/80 px-4 py-2 text-sm text-[#80b3ff] backdrop-blur-sm">
            <Terminal className="h-4 w-4" />
            <span>Default credentials:</span>
          </div>
          <div className="mt-2 text-sm text-[#b3d1ff]">
            <p>
              Student: username: <code className="rounded bg-[#2a2a35] px-1.5 py-0.5">event</code>, password:{" "}
              <code className="rounded bg-[#2a2a35] px-1.5 py-0.5">event</code>
            </p>
            <p className="mt-1">
              Staff: username: <code className="rounded bg-[#2a2a35] px-1.5 py-0.5">admin</code>, password:{" "}
              <code className="rounded bg-[#2a2a35] px-1.5 py-0.5">admin</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
