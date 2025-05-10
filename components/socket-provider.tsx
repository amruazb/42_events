"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { io, type Socket } from "socket.io-client"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/components/language-provider"

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

export function useSocket() {
  return useContext(SocketContext)
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { toast } = useToast()
  const { t } = useLanguage()

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || "", {
      path: "/api/socket",
      addTrailingSlash: false,
    })

    socketInstance.on("connect", () => {
      setIsConnected(true)
    })

    socketInstance.on("disconnect", () => {
      setIsConnected(false)
    })

    // Listen for new events
    socketInstance.on("event:created", (data) => {
      toast({
        title: t("new_event"),
        description: data.title,
        duration: 5000,
      })
    })

    // Listen for updated events
    socketInstance.on("event:updated", (data) => {
      toast({
        title: t("event_updated"),
        description: data.title,
        duration: 3000,
      })
    })

    // Listen for deleted events
    socketInstance.on("event:deleted", (data) => {
      toast({
        title: t("event_deleted"),
        description: data.title,
        duration: 3000,
      })
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [toast, t])

  return <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>
}
