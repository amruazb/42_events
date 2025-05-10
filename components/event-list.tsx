"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { EventCard } from "@/components/event-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { Skeleton } from "@/components/ui/skeleton"

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
}

export function EventList({ initialEvents = [] }: { initialEvents?: Event[] }) {
  const { t, language } = useLanguage()
  const searchParams = useSearchParams()

  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(initialEvents)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(initialEvents.length === 0)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [activeFilter, setActiveFilter] = useState("all")

  // Fetch events if not provided
  useEffect(() => {
    const fetchEvents = async () => {
      if (initialEvents.length === 0) {
        setIsLoading(true)
        try {
          const response = await fetch("/api/events")
          const data = await response.json()
          setEvents(data)
          setFilteredEvents(data)
        } catch (error) {
          console.error("Error fetching events:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchEvents()
  }, [initialEvents])

  // Apply search and filters
  useEffect(() => {
    const category = searchParams.get("category")
    if (category) {
      setActiveFilter(category)
    }

    const query = searchParams.get("q")
    if (query) {
      setSearchQuery(query)
    }

    // Filter events based on search query, tab, and category filter
    let filtered = [...events] // Create a new array to avoid mutating the original

    // Filter by tab (upcoming or past)
    const now = new Date()
    if (activeTab === "upcoming") {
      filtered = filtered.filter((event) => event && new Date(event.startDate) >= now)
    } else {
      filtered = filtered.filter((event) => event && new Date(event.startDate) < now)
    }

    // Filter by category
    if (activeFilter !== "all") {
      filtered = filtered.filter((event) => event && event.category?.toLowerCase() === activeFilter.toLowerCase())
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event &&
          event.title?.[language]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description?.[language]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location?.[language]?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort by date (upcoming: soonest first, past: most recent first)
    filtered = filtered.sort((a, b) => {
      if (activeTab === "upcoming") {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      } else {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      }
    })

    setFilteredEvents(filtered)
  }, [events, searchQuery, activeTab, activeFilter, searchParams, language])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleFilterChange = (value: string) => {
    setActiveFilter(value)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={t("search")} value={searchQuery} onChange={handleSearch} className="pl-9" />
        </div>

        <div className="flex gap-2">
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange("all")}
          >
            {t("all")}
          </Button>
          <Button
            variant={activeFilter === "workshop" ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange("workshop")}
          >
            {t("workshop")}
          </Button>
          <Button
            variant={activeFilter === "hackathon" ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange("hackathon")}
          >
            {t("hackathon")}
          </Button>
          <Button
            variant={activeFilter === "meetup" ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange("meetup")}
          >
            {t("meetup")}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="upcoming" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">{t("upcoming_events")}</TabsTrigger>
          <TabsTrigger value="past">{t("past_events")}</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t("no_events")}</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t("no_events")}</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
