"use client"

import type React from "react"
import { createContext, useContext } from "react"
import { useNotifications, type Notification } from "@/hooks/use-notifications"

interface NotificationsContextType {
  notifications: Notification[]
  addNotification: (title: string, message: string) => void
  markAsRead: (id: string) => void
  clearAll: () => void
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const notificationsData = useNotifications()

  return <NotificationsContext.Provider value={notificationsData}>{children}</NotificationsContext.Provider>
}

export const useNotificationsContext = () => {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error("useNotificationsContext must be used within a NotificationsProvider")
  }
  return context
}
