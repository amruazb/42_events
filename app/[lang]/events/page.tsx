"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { EventList } from "@/components/event-list"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { getEvents } from "@/lib/api/events"

export default function EventsPage({
  params: { lang },
}: {
  params: { lang: string }
}) {
  const { data: session } = useSession()
  const router = useRouter()
  const { t } = useLanguage()
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents({})
        setEvents(data)
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{t("events")}</h1>
          {session?.user && (
            <Button onClick={() => router.push(`/${lang}/admin`)}>
              {t("admin_panel")}
            </Button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <div className="h-48 w-full bg-muted animate-pulse rounded-lg" />
                <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
                <div className="h-10 w-full bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        ) : (
          <EventList initialEvents={events} />
        )}
      </main>

      <footer className="bg-background border-t border-border py-6">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground text-center">© 2024 42 Abu Dhabi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
} 