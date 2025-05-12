"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import type { Event } from "@/lib/types"
import { useBroadcastChannel } from "@/hooks/use-broadcast-channel"
import { EventCard } from "@/components/event-card"

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
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-md bg-muted"></div>
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

  // Function to determine event type based on tags
  const getEventType = (event: Event): "meetup" | "hackathon" | "piscine" => {
    if (event.tags?.some((tag) => tag.toLowerCase().includes("hackathon"))) {
      return "hackathon"
    } else if (event.tags?.some((tag) => tag.toLowerCase().includes("piscine"))) {
      return "piscine"
    }
    return "meetup"
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Link key={event._id} href={`/event/${event._id}`}>
          <EventCard event={event} type={getEventType(event)} />
        </Link>
      ))}
    </div>
  )
}
