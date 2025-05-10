import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { EventList } from "@/components/event-list"
import { Skeleton } from "@/components/ui/skeleton"
import { getEvents } from "@/lib/api/events"

export default async function EventsPage() {
  // Get all events
  const events = await getEvents()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Events</h1>

        <Suspense
          fallback={
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Skeleton className="h-10 flex-grow" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-20" />
                </div>
              </div>

              <Skeleton className="h-12 w-full" />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="space-y-3">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </div>
          }
        >
          <EventList initialEvents={events} />
        </Suspense>
      </main>

      <footer className="bg-background border-t border-border py-6">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground text-center">© 2024 42 Abu Dhabi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
