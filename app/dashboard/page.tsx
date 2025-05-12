"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Suspense } from "react"
import EventsList from "@/components/events-list"
import SearchBar from "@/components/search-bar"
import EventsListSkeleton from "@/components/events-list-skeleton"
import NotificationProvider from "@/components/notification-provider"
import FeaturedEvent from "@/components/featured-event"
import EventsStats from "@/components/events-stats"
import EventsFilters from "@/components/events-filters"
import { NotificationsProvider } from "@/components/notifications-provider"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login/user")
    }
  }, [user, isLoading, router])

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
    return null // Will redirect in useEffect
  }

  return (
    <NotificationsProvider>
      <NotificationProvider>
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">USER DASHBOARD</h1>
              <div className="flex gap-2">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  MY EVENTS
                </Button>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  FAVORITES
                </Button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-[1fr_300px]">
              <div className="space-y-6">
                <FeaturedEvent />
                <SearchBar />
                <Suspense fallback={<EventsListSkeleton />}>
                  <EventsList />
                </Suspense>
              </div>

              <div className="space-y-6">
                <div className="grid gap-4">
                  <EventsStats />
                </div>
                <EventsFilters />
              </div>
            </div>
          </div>
        </main>
      </NotificationProvider>
    </NotificationsProvider>
  )
}
