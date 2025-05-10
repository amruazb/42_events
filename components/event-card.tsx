"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, MapPin } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"

interface EventCardProps {
  event: {
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
  }
}

export function EventCard({ event }: EventCardProps) {
  const { language, t } = useLanguage()
  const [imageError, setImageError] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat(language, {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat(language, {
      hour: "numeric",
      minute: "numeric",
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
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
      <div className="relative h-48 w-full">
        {!imageError && event.image ? (
          <Image
            src={event.image || "/placeholder.svg"}
            alt={event.title[language]}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-4xl font-bold text-primary">42</span>
          </div>
        )}
        <Badge
          className={`absolute top-2 ${language === "ar" ? "left-2" : "right-2"} ${getCategoryColor(event.category)}`}
        >
          {t(event.category.toLowerCase())}
        </Badge>
      </div>

      <CardContent className="flex-grow pt-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{event.title[language]}</h3>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{formatDate(event.startDate)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>
              {formatTime(event.startDate)} - {formatTime(event.endDate)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="line-clamp-1">{event.location[language]}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-4">
        <Link href={`/events/${event._id}`} className="w-full">
          <Button variant="outline" className="w-full">
            {t("event_details")}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
