"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Edit, Trash2, Search, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/components/language-provider"
import { useSocket } from "@/components/socket-provider"

interface AdminEventListProps {
  onEditEvent: (event: any) => void
}

export function AdminEventList({ onEditEvent }: AdminEventListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { t, language } = useLanguage()
  const { socket } = useSocket()

  const [events, setEvents] = useState<any[]>([])
  const [filteredEvents, setFilteredEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<any>(null)

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/events")
        const data = await response.json()
        setEvents(data)
        setFilteredEvents(data)
      } catch (error) {
        console.error("Error fetching events:", error)
        toast({
          title: t("error"),
          description: t("error_fetching_events"),
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()

    // Listen for real-time updates
    if (socket) {
      const handleEventCreated = (newEvent: any) => {
        setEvents((prev) => [newEvent, ...prev])
      }

      const handleEventUpdated = (updatedEvent: any) => {
        setEvents((prev) => prev.map((event) => (event._id === updatedEvent._id ? updatedEvent : event)))
      }

      const handleEventDeleted = (deletedEvent: any) => {
        setEvents((prev) => prev.filter((event) => event._id !== deletedEvent._id))
      }

      socket.on("event:created", handleEventCreated)
      socket.on("event:updated", handleEventUpdated)
      socket.on("event:deleted", handleEventDeleted)

      return () => {
        socket.off("event:created", handleEventCreated)
        socket.off("event:updated", handleEventUpdated)
        socket.off("event:deleted", handleEventDeleted)
      }
    }
  }, [socket, toast, t])

  // Filter events based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEvents(events)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = events.filter(
        (event) =>
          event.title[language].toLowerCase().includes(query) ||
          event.location[language].toLowerCase().includes(query) ||
          event.category.toLowerCase().includes(query),
      )
      setFilteredEvents(filtered)
    }
  }, [events, searchQuery, language])

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat(language, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  // Handle delete event
  const handleDeleteClick = (event: any) => {
    setEventToDelete(event)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return

    try {
      const response = await fetch(`/api/events/${eventToDelete._id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: t("event_deleted"),
          description: eventToDelete.title[language],
        })

        // Remove from local state if not using real-time updates
        if (!socket) {
          setEvents(events.filter((e) => e._id !== eventToDelete._id))
        }
      } else {
        throw new Error("Failed to delete event")
      }
    } catch (error) {
      console.error("Error deleting event:", error)
      toast({
        title: t("error"),
        description: t("error_deleting_event"),
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setEventToDelete(null)
    }
  }

  // View event details
  const handleViewEvent = (eventId: string) => {
    router.push(`/events/${eventId}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-4 rtl:space-x-reverse">
              <Skeleton className="h-12 flex-grow" />
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
            </div>
          ))}
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("title")}</TableHead>
                <TableHead>{t("category")}</TableHead>
                <TableHead>{t("date")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event._id}>
                  <TableCell className="font-medium">{event.title[language]}</TableCell>
                  <TableCell>{event.category}</TableCell>
                  <TableCell>{formatDate(event.startDate)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleViewEvent(event._id)}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">{t("view")}</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onEditEvent(event)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">{t("edit")}</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(event)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">{t("delete")}</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("no_events")}</p>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("delete_event")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("delete_event_confirmation")}
              {eventToDelete && <span className="font-medium block mt-2">{eventToDelete.title[language]}</span>}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
