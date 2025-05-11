import { getEventById } from "@/lib/events"
import { formatDate } from "@/lib/utils"
import { CalendarIcon, Clock, MapPin } from "lucide-react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function EventPage({ params }: { params: { id: string } }) {
  const event = await getEventById(params.id)

  if (!event) {
    notFound()
  }

  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              ← Back to events
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{event.title}</h1>
              <div className="mt-2 flex flex-wrap gap-2">
                {event.tags?.map((tag: string) => (
                  <span key={tag} className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                    {tag}
                  </span>
                ))}
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
                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                <span>{formatDate(event.date)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>{new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              </div>

              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>

            <Button className="mt-6 w-full">Register for Event</Button>
          </div>
        </div>
      </div>
    </main>
  )
}
