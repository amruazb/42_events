"use client"

import type React from "react"

import { useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

export default function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()

  useEffect(() => {
    const handleShowNotification = (event: Event) => {
      const customEvent = event as CustomEvent
      const { title, body } = customEvent.detail

      toast({
        title,
        description: body,
      })

      // Show browser notification if supported and permission granted
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification(title, { body })
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              new Notification(title, { body })
            }
          })
        }
      }
    }

    window.addEventListener("show-notification", handleShowNotification)

    return () => {
      window.removeEventListener("show-notification", handleShowNotification)
    }
  }, [toast])

  return <>{children}</>
}
