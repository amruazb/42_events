import { getEventById } from "@/lib/events"
import { formatDate } from "@/lib/utils"
import { Calendar, Clock, MapPin } from "lucide-react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function EventPage({ params }: { params: { id: string } }) {
  const event = await getEventById(params.id)

  if (!event) {
    notFound()
  }

  // Determine event type based on tags
  const getEventType = (): "meetup" | "hackathon" | "piscine" => {
    if (event.tags?.some((tag) => tag.toLowerCase().includes("hackathon"))) {
      return "hackathon"
    } else if (event.tags?.some((tag) => tag.toLowerCase().includes("piscine"))) {
      return "piscine"
    }
    return "meetup"
  }

  const eventType = getEventType()
  const typeDisplayMap = {
    meetup: "Meet up",
    hackathon: "Hackathon",
    piscine: "Piscine",
  }

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

  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-primary">
              ← Back to events
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className={`event-date-sidebar event-${eventType} rounded-md`}>
                <div className="text-lg font-medium">{day}</div>
                <div className="text-3xl font-bold">{date}</div>
                <div className="text-sm">{month}</div>
              </div>
              <div>
                <div className={`text-${eventType} text-xl font-bold`}>{typeDisplayMap[eventType]}</div>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{event.title}</h1>
                <div className="mt-2 flex flex-wrap gap-2">
                  {event.tags?.map((tag: string) => (
                    <span key={tag} className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="prose max-w-none dark:prose-invert">
              <p>{event.description}</p>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Event Details</h2>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>{formatDate(event.date)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>
                  {eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  {" - "}
                  {diffDays === 0 ? "Today" : diffDays === 1 ? "Tomorrow" : `in ${diffDays} days`}
                </span>
              </div>

              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>

            <Button className="mt-6 w-full bg-primary hover:bg-primary/90">Register for Event</Button>
          </div>
        </div>
      </div>
    </main>
  )
}
