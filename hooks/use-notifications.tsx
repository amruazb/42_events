"use client"

import { useState, useEffect, useCallback } from "react"
import { v4 as uuidv4 } from "uuid"

export interface Notification {
  id: string
  title: string
  message: string
  timestamp: number
  read: boolean
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Load notifications from localStorage on mount
  useEffect(() => {
    const storedNotifications = localStorage.getItem("notifications")
    if (storedNotifications) {
      try {
        setNotifications(JSON.parse(storedNotifications))
      } catch (e) {
        console.error("Failed to parse notifications from localStorage", e)
      }
    }
  }, [])

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications))
  }, [notifications])

  // Listen for custom notification events
  useEffect(() => {
    const handleShowNotification = (event: Event) => {
      const customEvent = event as CustomEvent
      const { title, body } = customEvent.detail

      addNotification(title, body)
    }

    window.addEventListener("show-notification", handleShowNotification)

    return () => {
      window.removeEventListener("show-notification", handleShowNotification)
    }
  }, [])

  const addNotification = useCallback((title: string, message: string) => {
    const newNotification: Notification = {
      id: uuidv4(),
      title,
      message,
      timestamp: Date.now(),
      read: false,
    }

    setNotifications((prev) => [newNotification, ...prev].slice(0, 50)) // Keep only the latest 50 notifications
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  return { notifications, addNotification, markAsRead, clearAll }
}
