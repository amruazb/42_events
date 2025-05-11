import { Suspense } from "react"
import EventsList from "@/components/events-list"
import SearchBar from "@/components/search-bar"
import EventsListSkeleton from "@/components/events-list-skeleton"
import NotificationProvider from "@/components/notification-provider"
import FeaturedEvent from "@/components/featured-event"
import EventsStats from "@/components/events-stats"
import EventsFilters from "@/components/events-filters"
import { NotificationsProvider } from "@/components/notifications-provider"

export default function Home() {
  return (
    <NotificationsProvider>
      <NotificationProvider>
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Events Dashboard</h1>
              <p className="text-muted-foreground">Discover and manage upcoming events</p>
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
