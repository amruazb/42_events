"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Calendar, ShieldCheck, User } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

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
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <div className="mb-8 flex items-center justify-center">
        <Calendar className="mr-2 h-10 w-10 text-primary" />
        <h1 className="text-4xl font-bold text-primary">Events Management</h1>
      </div>

      <div className="grid w-full max-w-4xl gap-6 md:grid-cols-2">
        <Card className="border-primary/20">
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center text-primary">
              <User className="mr-2 h-5 w-5" />
              User Login
            </CardTitle>
            <CardDescription>Access the events dashboard as a regular user</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-4 text-sm text-muted-foreground">
              Login as a user to view and interact with events. Users can browse events, export data, and receive
              notifications.
            </p>
            <Link href="/login/user">
              <Button className="w-full bg-primary hover:bg-primary/90">Login as User</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-secondary/20">
          <CardHeader className="bg-secondary/5">
            <CardTitle className="flex items-center text-secondary">
              <ShieldCheck className="mr-2 h-5 w-5" />
              Admin Login
            </CardTitle>
            <CardDescription>Access the admin dashboard with full control</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-4 text-sm text-muted-foreground">
              Login as an administrator to manage events, users, and system settings. Admins have full control over the
              application.
            </p>
            <Link href="/login/admin">
              <Button className="w-full bg-secondary hover:bg-secondary/90">Login as Admin</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          Default credentials:
          <br />
          User: username: <strong>event</strong>, password: <strong>event</strong>
          <br />
          Admin: username: <strong>admin</strong>, password: <strong>admin</strong>
        </p>
      </div>
    </div>
  )
}
