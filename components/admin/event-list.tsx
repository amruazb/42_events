"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, Trash2, ExternalLink } from "lucide-react"
import { format } from "date-fns"
import { enUS, ar, fr } from "date-fns/locale"

const dateLocales = {
  en: enUS,
  ar,
  fr,
}

export function AdminEventList() {
  const { t, lang } = useLanguage()
  const [events, setEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch events
  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events")
      if (!response.ok) {
        throw new Error("Failed to fetch events")
      }
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error("Error fetching events:", error)
      setError(t("error_fetching_events"))
    } finally {
      setIsLoading(false)
    }
  }

  // Delete event
  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm(t("confirm_delete_event"))) return

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete event")
      }

      // Remove event from state
      setEvents((prev) => prev.filter((event) => event._id !== eventId))
    } catch (error) {
      console.error("Error deleting event:", error)
      alert(t("error_deleting_event"))
    }
  }

  // Load events on mount
  useState(() => {
    fetchEvents()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="bg-[#242424] border-gray-800">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-700 rounded w-3/4" />
                <div className="h-4 bg-gray-700 rounded w-full" />
                <div className="flex gap-4">
                  <div className="h-4 bg-gray-700 rounded w-24" />
                  <div className="h-4 bg-gray-700 rounded w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="bg-[#242424] border-gray-800">
        <CardContent className="p-6">
          <div className="text-center text-red-400">
            <p>{error}</p>
            <Button
              variant="outline"
              onClick={fetchEvents}
              className="mt-4 border-gray-700 text-white hover:bg-gray-800"
            >
              {t("retry")}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (events.length === 0) {
    return (
      <Card className="bg-[#242424] border-gray-800">
        <CardContent className="p-6">
          <div className="text-center text-gray-400">
            <p>{t("no_events_found")}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event._id} className="bg-[#242424] border-gray-800 hover:border-gray-700 transition-colors">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white">{event.title[lang]}</h3>
                <p className="text-gray-400">{event.description[lang]}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(new Date(event.startDate), "PPP", {
                        locale: dateLocales[lang as keyof typeof dateLocales],
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location[lang]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{event.category}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open(event.url, "_blank")}
                  className="text-gray-400 hover:text-white"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteEvent(event._id)}
                  className="text-gray-400 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
