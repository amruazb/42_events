"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Calendar, FileSpreadsheet } from "lucide-react"
import { NotificationsProvider } from "@/components/notifications-provider"
import type { Event } from "@/lib/types"

export default function ExportPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvents, setSelectedEvents] = useState<Record<string, boolean>>({})
  const { toast } = useToast()

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events")
        const data = await response.json()
        setEvents(data)

        // Initialize all events as selected
        const initialSelected: Record<string, boolean> = {}
        data.forEach((event: Event) => {
          initialSelected[event._id] = true
        })
        setSelectedEvents(initialSelected)
      } catch (error) {
        console.error("Error fetching events:", error)
      }
    }

    fetchEvents()
  }, [])

  const handleSelectAll = (checked: boolean) => {
    const newSelected: Record<string, boolean> = {}
    events.forEach((event) => {
      newSelected[event._id] = checked
    })
    setSelectedEvents(newSelected)
  }

  const handleSelectEvent = (id: string, checked: boolean) => {
    setSelectedEvents((prev) => ({
      ...prev,
      [id]: checked,
    }))
  }

  const exportToCSV = () => {
    const selectedEventsData = events.filter((event) => selectedEvents[event._id])

    if (selectedEventsData.length === 0) {
      toast({
        title: "No events selected",
        description: "Please select at least one event to export",
        variant: "destructive",
      })
      return
    }

    const headers = ["Title", "Description", "Date", "Location", "Tags"]
    const csvContent = [
      headers.join(","),
      ...selectedEventsData.map((event) => {
        return [
          `"${event.title.replace(/"/g, '""')}"`,
          `"${event.description.replace(/"/g, '""')}"`,
          `"${new Date(event.date).toISOString()}"`,
          `"${event.location || ""}"`,
          `"${event.tags?.join(", ") || ""}"`,
        ].join(",")
      }),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "events.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export successful",
      description: `Exported ${selectedEventsData.length} events to CSV`,
    })
  }

  const exportToICS = () => {
    const selectedEventsData = events.filter((event) => selectedEvents[event._id])

    if (selectedEventsData.length === 0) {
      toast({
        title: "No events selected",
        description: "Please select at least one event to export",
        variant: "destructive",
      })
      return
    }

    let icsContent = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Events App//EN\r\n"

    selectedEventsData.forEach((event) => {
      const startDate = new Date(event.date)
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000) // Add 1 hour

      icsContent += "BEGIN:VEVENT\r\n"
      icsContent += `UID:${event._id}@eventsapp.com\r\n`
      icsContent += `DTSTAMP:${new Date().toISOString().replace(/[-:.]/g, "").split("T")[0]}T${
        new Date().toISOString().replace(/[-:.]/g, "").split("T")[1].split(".")[0]
      }Z\r\n`
      icsContent += `DTSTART:${startDate.toISOString().replace(/[-:.]/g, "").split("T")[0]}T${
        startDate.toISOString().replace(/[-:.]/g, "").split("T")[1].split(".")[0]
      }Z\r\n`
      icsContent += `DTEND:${endDate.toISOString().replace(/[-:.]/g, "").split("T")[0]}T${
        endDate.toISOString().replace(/[-:.]/g, "").split("T")[1].split(".")[0]
      }Z\r\n`
      icsContent += `SUMMARY:${event.title}\r\n`
      icsContent += `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}\r\n`
      if (event.location) {
        icsContent += `LOCATION:${event.location}\r\n`
      }
      icsContent += "END:VEVENT\r\n"
    })

    icsContent += "END:VCALENDAR"

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "events.ics")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export successful",
      description: `Exported ${selectedEventsData.length} events to ICS`,
    })
  }

  return (
    <NotificationsProvider>
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Export Events</h1>
            <p className="text-muted-foreground">Export your events to different formats</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Export to CSV</CardTitle>
                <CardDescription>
                  Export your events to a CSV file that can be opened in Excel or Google Sheets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={exportToCSV} className="w-full">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export to CSV
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export to Calendar</CardTitle>
                <CardDescription>
                  Export your events to an ICS file that can be imported into calendar applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={exportToICS} className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Export to ICS
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Select Events to Export</h2>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="select-all"
                  checked={Object.values(selectedEvents).every(Boolean) && Object.keys(selectedEvents).length > 0}
                  onCheckedChange={(checked) => handleSelectAll(checked === true)}
                />
                <Label htmlFor="select-all">Select All</Label>
              </div>
            </div>

            <div className="rounded-lg border">
              {events.length > 0 ? (
                <div className="divide-y">
                  {events.map((event) => (
                    <div key={event._id} className="flex items-center gap-3 p-4">
                      <Checkbox
                        id={`event-${event._id}`}
                        checked={selectedEvents[event._id] || false}
                        onCheckedChange={(checked) => handleSelectEvent(event._id, checked === true)}
                      />
                      <div className="grid gap-1">
                        <Label htmlFor={`event-${event._id}`} className="font-medium">
                          {event.title}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString()} at{" "}
                          {new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">No events found</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </NotificationsProvider>
  )
}
