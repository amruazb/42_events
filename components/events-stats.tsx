"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Clock, Users } from "lucide-react"
import type { Event } from "@/lib/types"

export default function EventsStats() {
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    thisMonth: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/events")
        const events = await response.json()

        const now = new Date()
        const upcoming = events.filter((event: Event) => new Date(event.date) > now)

        const thisMonth = events.filter((event: Event) => {
          const eventDate = new Date(event.date)
          return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear()
        })

        setStats({
          total: events.length,
          upcoming: upcoming.length,
          thisMonth: thisMonth.length,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Events Overview</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Total Events</span>
          </div>
          <span className="font-medium">
            {loading ? <span className="h-4 w-8 animate-pulse rounded bg-muted"></span> : stats.total}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Upcoming Events</span>
          </div>
          <span className="font-medium">
            {loading ? <span className="h-4 w-8 animate-pulse rounded bg-muted"></span> : stats.upcoming}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">This Month</span>
          </div>
          <span className="font-medium">
            {loading ? <span className="h-4 w-8 animate-pulse rounded bg-muted"></span> : stats.thisMonth}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
