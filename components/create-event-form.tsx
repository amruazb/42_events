"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useBroadcastChannel } from "@/hooks/use-broadcast-channel"
import { useNotificationsContext } from "@/components/notifications-provider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CreateEventForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    tags: "",
    type: "meetup", // Default type
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { postMessage } = useBroadcastChannel("events-channel")
  const { addNotification } = useNotificationsContext()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.date) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Add the type as a tag
      const tags = formData.tags
        ? [
            ...formData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean),
            formData.type,
          ]
        : [formData.type]

      const eventData = {
        ...formData,
        tags,
      }

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      })

      if (!response.ok) {
        throw new Error("Failed to create event")
      }

      const newEvent = await response.json()

      // Broadcast the new event to other tabs
      postMessage({
        type: "event-created",
        event: newEvent,
      })

      // Add to notifications
      addNotification("New Event Created", `"${newEvent.title}" has been added to the events list.`)

      // Show notification
      const notificationEvent = new CustomEvent("show-notification", {
        detail: {
          title: "New Event Created",
          body: `"${newEvent.title}" has been added to the events list.`,
        },
      })
      window.dispatchEvent(notificationEvent)

      toast({
        title: "Success",
        description: "Event created successfully",
      })

      // Reset form
      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        tags: "",
        type: "meetup",
      })
    } catch (error) {
      console.error("Error creating event:", error)
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="bg-primary/5">
        <CardTitle className="text-primary">Create New Event</CardTitle>
        <CardDescription>Fill in the details to create a new event</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Event Type *</Label>
            <Select value={formData.type} onValueChange={handleTypeChange}>
              <SelectTrigger className="border-primary/50 focus:ring-primary">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meetup">Meet up</SelectItem>
                <SelectItem value="hackathon">Hackathon</SelectItem>
                <SelectItem value="piscine">Piscine</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="border-primary/50 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="border-primary/50 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date and Time *</Label>
            <Input
              id="date"
              name="date"
              type="datetime-local"
              value={formData.date}
              onChange={handleChange}
              required
              className="border-primary/50 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="border-primary/50 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="conference, workshop, meetup"
              className="border-primary/50 focus-visible:ring-primary"
            />
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Event"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
