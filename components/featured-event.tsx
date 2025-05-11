"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Star } from "lucide-react"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import type { Event } from "@/lib/types"

export default function FeaturedEvent() {
  const [featuredEvent, setFeaturedEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedEvent = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/events")
        const data = await response.json()

        // Get the nearest upcoming event as featured
        const upcomingEvents = data.filter((event: Event) => new Date(event.date) > new Date())
        if (upcomingEvents.length > 0) {
          setFeaturedEvent(upcomingEvents[0])
        }
      } catch (error) {
        console.error("Error fetching featured event:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedEvent()
  }, [])

  if (loading) {
    return (
      <Card className="overflow-hidden">
        <div className="h-48 animate-pulse bg-muted"></div>
        <CardContent className="p-6">
          <div className="space-y-2">
            <div className="h-6 w-2/3 animate-pulse rounded bg-muted"></div>
            <div className="h-4 animate-pulse rounded bg-muted"></div>
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!featuredEvent) {
    return null
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <Star className="h-16 w-16 text-white opacity-20" />
        </div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-blue-600">Featured Event</span>
          </div>
          <h3 className="mt-2 text-2xl font-bold text-white">{featuredEvent.title}</h3>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="space-y-4">
          <p className="line-clamp-2 text-muted-foreground">{featuredEvent.description}</p>

          <div className="grid gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(featuredEvent.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{new Date(featuredEvent.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
            {featuredEvent.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{featuredEvent.location}</span>
              </div>
            )}
          </div>

          <Link href={`/event/${featuredEvent._id}`}>
            <Button className="w-full">View Details</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
