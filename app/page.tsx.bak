import { Suspense } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { EventList } from "@/components/event-list"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getEvents } from "@/lib/api/events"

export default async function Home() {
  // Get upcoming events
  const events = await getEvents({ limit: 6, upcoming: true })

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-background to-muted py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              42 Abu Dhabi Events
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Discover and participate in exciting events at 42 Abu Dhabi. From workshops to hackathons, find everything
              happening in our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/events">
                <Button size="lg">Browse All Events</Button>
              </Link>
              <Link href="/auth/signin">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Upcoming Events</h2>
              <Link href="/events">
                <Button variant="link">View All</Button>
              </Link>
            </div>

            <Suspense
              fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              }
            >
              <EventList initialEvents={events} />
            </Suspense>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">Features</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Multilingual Support</h3>
                <p className="text-muted-foreground">
                  Access all content in English, Arabic, and French. Switch languages anytime with our language
                  selector.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Offline Access</h3>
                <p className="text-muted-foreground">
                  Events remain available offline with our Progressive Web App capabilities. Never miss an event due to
                  connectivity issues.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Real-time Updates</h3>
                <p className="text-muted-foreground">
                  Get notified instantly when new events are added or existing ones are updated with our real-time
                  notification system.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-background border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">© 2024 42 Abu Dhabi. All rights reserved.</p>
            </div>

            <div className="flex space-x-6 rtl:space-x-reverse">
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
