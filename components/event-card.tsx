import { Calendar, Clock, MapPin } from "lucide-react"
import type { Event } from "@/lib/types"

interface EventCardProps {
  event: Event
  type?: "meetup" | "hackathon" | "piscine"
}

export function EventCard({ event, type = "meetup" }: EventCardProps) {
  // Get day, date, and month
  const eventDate = new Date(event.date)
  const day = eventDate.toLocaleDateString("en-US", { weekday: "short" })
  const date = eventDate.getDate()
  const month = eventDate.toLocaleDateString("en-US", { month: "short" })

  // Calculate days until event
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const eventDay = new Date(eventDate)
  eventDay.setHours(0, 0, 0, 0)
  const diffTime = eventDay.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  // Format time
  const time = eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  // Determine duration (placeholder - would need actual duration data)
  const duration = "1h"

  // Map event type to display name
  const typeDisplayMap = {
    meetup: "Meet up",
    hackathon: "Hackathon",
    piscine: "Piscine",
  }

  return (
    <div className="event-card">
      <div className={`event-date-sidebar event-${type}`}>
        <div className="text-lg font-medium">{day}</div>
        <div className="text-3xl font-bold">{date}</div>
        <div className="text-sm">{month}</div>
      </div>
      <div className="event-content">
        <div className={`event-type text-${type}`}>{typeDisplayMap[type]}</div>
        <h3 className="event-title">{event.title}</h3>
        <div className="event-details">
          <div className="event-detail">
            <Calendar className="h-4 w-4" />
            <span>{duration}</span>
          </div>
          <div className="event-detail">
            <Clock className="h-4 w-4" />
            <span>{diffDays === 0 ? "Today" : diffDays === 1 ? "Tomorrow" : `in ${diffDays} days`}</span>
          </div>
          {event.location && (
            <div className="event-detail">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
