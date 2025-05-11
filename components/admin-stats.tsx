"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Clock, Users } from "lucide-react"
import type { Event } from "@/lib/types"

export default function AdminStats() {
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

  const statCards = [
    {
      title: "Total Events",
      value: stats.total,
      icon: CalendarDays,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      title: "Upcoming Events",
      value: stats.upcoming,
      icon: Clock,
      color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    },
    {
      title: "This Month",
      value: stats.thisMonth,
      icon: Users,
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    },
  ]

  return (
    <>
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`rounded-full p-2 ${stat.color}`}>
              <stat.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <div className="h-8 w-16 animate-pulse rounded bg-muted"></div> : stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}
