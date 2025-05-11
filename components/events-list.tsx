"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { useSearchParams } from "next/navigation"
import type { Event } from "@/lib/types"
import { useBroadcastChannel } from "@/hooks/use-broadcast-channel"

export default function EventsList() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")
  const categories = searchParams.get("categories")

  // Set up broadcast channel for real-time sync
  useBroadcastChannel("events-channel", (message) => {
    if (message.type === "event-created") {
      setEvents((prev) => [message.event, ...prev])
    } else if (message.type === "event-updated") {
      setEvents((prev) => prev.map((event) => (event._id === message.event._id ? message.event : event)))
    } else if (message.type === "event-deleted") {
      setEvents((prev) => prev.filter((event) => event._id !== message.eventId))
    }
  })

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        let url = query ? `/api/events/search?q=${encodeURIComponent(query)}` : "/api/events"

        // Add date filters if present
        const params = new URLSearchParams()
        if (query) params.append("q", query)
        if (startDate) params.append("startDate", startDate)
        if (endDate) params.append("endDate", endDate)

        url = `/api/events/search?${params.toString()}`

        const response = await fetch(url)
        let data = await response.json()

        // Client-side filtering for categories if needed
        if (categories) {
          const categoryList = categories.split(",")
          data = data.filter((event: Event) => event.tags?.some((tag) => categoryList.includes(tag.toLowerCase())))
        }

        setEvents(data)
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [query, startDate, endDate, categories])

  if (loading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex animate-pulse flex-col gap-2 p-4 sm:flex-row sm:items-center">
                <div className="h-16 w-16 rounded-md bg-muted"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-muted"></div>
                  <div className="h-3 w-1/2 rounded bg-muted"></div>
                </div>
                <div className="h-8 w-24 rounded bg-muted"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <h2 className="text-xl font-semibold">No events found</h2>
        <p className="mt-2 text-muted-foreground">
          {query ? `No events match "${query}"` : "There are no upcoming events at the moment"}
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {events.map((event) => (
        <Card key={event._id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Calendar className="h-8 w-8" />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{event.title}</h3>
                  {event.featured && <Badge>Featured</Badge>}
                  {event.tags?.map((tag) => (
                    <Badge key={tag} variant="outline" className="capitalize">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>{new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-3 w-3" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
              </div>

              <Link href={`/event/${event._id}`} className="sm:self-center">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
