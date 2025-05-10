import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, Clock, MapPin, ArrowLeft, Share2 } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getEvent } from "@/lib/api/events"
import { LanguageSelector } from "@/components/language-selector"

export default async function EventPage({ params }: { params: { id: string } }) {
  const event = await getEvent(params.id)

  if (!event) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/events">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Events</span>
            </Button>
          </Link>

          <LanguageSelector />
        </div>

        <Suspense fallback={<EventDetailSkeleton />}>
          <EventDetail event={event} />
        </Suspense>
      </main>

      <footer className="bg-background border-t border-border py-6">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground text-center">© 2024 42 Abu Dhabi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function EventDetail({ event }: { event: any }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "workshop":
        return "bg-blue-500"
      case "hackathon":
        return "bg-purple-500"
      case "meetup":
        return "bg-green-500"
      case "conference":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          {event.image ? (
            <Image src={event.image || "/placeholder.svg"} alt={event.title.en} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-4xl font-bold text-primary">42</span>
            </div>
          )}
          <Badge className={`absolute top-4 right-4 ${getCategoryColor(event.category)}`}>{event.category}</Badge>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{event.title.en}</h1>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>{formatDate(event.startDate)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>
                {formatTime(event.startDate)} - {formatTime(event.endDate)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span>{event.location.en}</span>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <div dangerouslySetInnerHTML={{ __html: event.description.en }} />
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-card rounded-lg p-6 sticky top-24">
          <h2 className="text-xl font-semibold mb-4">Event Details</h2>

          {event.capacity && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-1">Capacity</p>
              <p className="font-medium">{event.capacity} attendees</p>
            </div>
          )}

          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-1">Date</p>
            <p className="font-medium">{formatDate(event.startDate)}</p>
          </div>

          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-1">Time</p>
            <p className="font-medium">
              {formatTime(event.startDate)} - {formatTime(event.endDate)}
            </p>
          </div>

          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-1">Location</p>
            <p className="font-medium">{event.location.en}</p>
          </div>

          <div className="space-y-3">
            <Button className="w-full">Register Now</Button>
            <Button variant="outline" className="w-full gap-2">
              <Share2 className="h-4 w-4" />
              <span>Share Event</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function EventDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Skeleton className="aspect-video w-full rounded-lg" />

        <div>
          <Skeleton className="h-10 w-3/4 mb-4" />

          <div className="space-y-4 mb-6">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-6 w-2/3" />
          </div>

          <div>
            <Skeleton className="h-8 w-40 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-card rounded-lg p-6">
          <Skeleton className="h-8 w-40 mb-4" />

          <div className="mb-4">
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-6 w-1/2" />
          </div>

          <div className="mb-4">
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-6 w-2/3" />
          </div>

          <div className="mb-6">
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-6 w-3/4" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
