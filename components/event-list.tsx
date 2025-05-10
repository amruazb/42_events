"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Terminal } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { format } from "date-fns"
import { enUS, ar, fr } from "date-fns/locale"
import { motion } from "framer-motion"

interface Event {
  _id: string
  title: {
    en: string
    ar: string
    fr: string
  }
  description: {
    en: string
    ar: string
    fr: string
  }
  location: {
    en: string
    ar: string
    fr: string
  }
  startDate: string
  endDate: string
  category: string
  image?: string
  capacity?: number
  registrations?: number
}

interface EventListProps {
  initialEvents?: Event[]
  limit?: number
  upcoming?: boolean
  category?: string
}

const dateLocales = {
  en: enUS,
  ar: ar,
  fr: fr,
}

export function EventList({ initialEvents = [], limit, upcoming, category }: EventListProps) {
  const [events, setEvents] = useState<Event[]>(Array.isArray(initialEvents) ? initialEvents : [])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(Array.isArray(initialEvents) ? initialEvents : [])
  const [isLoading, setIsLoading] = useState(!Array.isArray(initialEvents) || initialEvents.length === 0)
  const [error, setError] = useState<string | null>(null)
  const { language, t } = useLanguage()

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const params = new URLSearchParams()
        if (limit) params.append("limit", limit.toString())
        if (upcoming) params.append("upcoming", "true")
        if (category) params.append("category", category)

        const response = await fetch(`/api/events?${params.toString()}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        if (!Array.isArray(data)) {
          console.error("Invalid events data received:", data)
          throw new Error("Invalid data format received from server")
        }

        setEvents(data)
        setFilteredEvents(data)
      } catch (err) {
        console.error("Error fetching events:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch events")
      } finally {
        setIsLoading(false)
      }
    }

    if (!Array.isArray(initialEvents) || initialEvents.length === 0) {
      fetchEvents()
    }
  }, [initialEvents, limit, upcoming, category])

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-[#1A1A1A] border-[#00BABC]/20 animate-pulse">
            <CardHeader>
              <div className="h-6 bg-[#00BABC]/10 rounded w-3/4 mb-2" />
              <div className="h-4 bg-[#00BABC]/10 rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-[#00BABC]/10 rounded w-full mb-2" />
              <div className="h-4 bg-[#00BABC]/10 rounded w-5/6" />
            </CardContent>
            <CardFooter>
              <div className="h-8 bg-[#00BABC]/10 rounded w-1/3" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-[#00BABC] mb-4 font-mono">{error}</p>
        <Button 
          onClick={() => window.location.reload()}
          className="bg-[#00BABC] hover:bg-[#00BABC]/90 text-white font-mono"
        >
          Retry
        </Button>
      </div>
    )
  }

  if (!Array.isArray(filteredEvents) || filteredEvents.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 font-mono">{t("no_events")}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredEvents.map((event, index) => (
        <motion.div
          key={event._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="bg-[#1A1A1A] border-[#00BABC]/20 hover:border-[#00BABC] transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,186,188,0.2)]">
            {event.image && (
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title[language]}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent" />
              </div>
            )}
            <CardHeader>
              <CardTitle className="font-mono text-[#00BABC]">{event.title[language]}</CardTitle>
              <CardDescription className="line-clamp-2 text-gray-400 font-mono">
                {event.description[language]}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center text-sm text-gray-400 font-mono">
                <Calendar className="mr-2 h-4 w-4 text-[#00BABC]" />
                {format(new Date(event.startDate), "PPP", {
                  locale: dateLocales[language],
                })}
              </div>
              <div className="flex items-center text-sm text-gray-400 font-mono">
                <MapPin className="mr-2 h-4 w-4 text-[#00BABC]" />
                {event.location[language]}
              </div>
              {event.capacity && (
                <div className="flex items-center text-sm text-gray-400 font-mono">
                  <Users className="mr-2 h-4 w-4 text-[#00BABC]" />
                  {event.registrations || 0} / {event.capacity}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <div className="flex items-center justify-between w-full">
                <Badge variant="secondary" className="bg-[#00BABC]/10 text-[#00BABC] font-mono">
                  {event.category}
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-[#00BABC] text-[#00BABC] hover:bg-[#00BABC]/10 font-mono"
                >
                  {t("view_details")}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
