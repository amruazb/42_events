"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminEventsList from "@/components/admin-events-list"
import CreateEventForm from "@/components/create-event-form"
import CsvImport from "@/components/csv-import"
import AdminStats from "@/components/admin-stats"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { NotificationsProvider } from "@/components/notifications-provider"
import { useAuth } from "@/hooks/use-auth"

export default function AdminPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { toast } = useToast()
  const { user, login, isLoading } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await login(username, password)
      toast({
        title: "Login successful",
        description: "Welcome to the admin panel",
      })
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4">
        <div className="w-full space-y-6 rounded-lg border bg-card p-6 shadow-md">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Loading...</h1>
            <p className="text-sm text-muted-foreground">Please wait while we verify your credentials</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4">
        <div className="w-full space-y-6 rounded-lg border bg-card p-6 shadow-md">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Admin Login</h1>
            <p className="text-sm text-muted-foreground">Enter your credentials to access the admin panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>

          <div className="text-center text-sm">
            <p>Default: username: admin, password: admin</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <NotificationsProvider>
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your events and settings</p>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <AdminStats />
          </div>

          <Tabs defaultValue="events">
            <TabsList className="mb-6">
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="create">Create Event</TabsTrigger>
              <TabsTrigger value="import">Import CSV</TabsTrigger>
            </TabsList>

            <TabsContent value="events">
              <AdminEventsList />
            </TabsContent>

            <TabsContent value="create">
              <CreateEventForm />
            </TabsContent>

            <TabsContent value="import">
              <CsvImport />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </NotificationsProvider>
  )
}
