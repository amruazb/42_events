"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Download, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/components/language-provider"

export function Import42Events() {
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useLanguage()

  const [isLoading, setIsLoading] = useState(false)
  const [events, setEvents] = useState<any[]>([])

  // Fetch events from 42 API
  const fetchEvents = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/42/events")

      if (!response.ok) {
        throw new Error("Failed to fetch events from 42 API")
      }

      const data = await response.json()
      setEvents(data)

      toast({
        title: t("events_fetched"),
        description: `${data.length} ${t("events_found")}`,
      })
    } catch (error) {
      console.error("Error fetching 42 events:", error)
      toast({
        title: t("error"),
        description: t("error_fetching_42_events"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Import events from 42 API
  const importEvents = async () => {
    if (events.length === 0) {
      toast({
        title: t("error"),
        description: t("no_events_to_import"),
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/42/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ events }),
      })

      if (!response.ok) {
        throw new Error("Failed to import events from 42 API")
      }

      const result = await response.json()

      toast({
        title: t("events_imported"),
        description: `${result.imported} ${t("events_imported_count")}`,
      })

      // Reset events
      setEvents([])

      // Refresh the page
      router.refresh()
    } catch (error) {
      console.error("Error importing 42 events:", error)
      toast({
        title: t("error"),
        description: t("error_importing_42_events"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("import_42_events")}</CardTitle>
        <CardDescription>{t("import_42_events_description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={fetchEvents} disabled={isLoading} className="w-full">
            {isLoading ? t("fetching") : t("fetch_42_events")}
            <RefreshCw className={`ml-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>

          {events.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {events.length} {t("events_found")}
              </p>
              <div className="max-h-60 overflow-y-auto rounded-md border p-2">
                {events.map((event) => (
                  <div key={event.id} className="py-1 border-b last:border-0">
                    <p className="font-medium">{event.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.begin_at).toLocaleDateString()} - {event.kind}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={importEvents} disabled={isLoading || events.length === 0} className="w-full">
          {isLoading ? t("importing") : t("import_events")}
          <Download className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
