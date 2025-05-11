"use client"

import { useEffect, useRef, useCallback } from "react"

type BroadcastMessage = {
  type: string
  [key: string]: any
}

export function useBroadcastChannel(channelName: string, onMessage?: (message: BroadcastMessage) => void) {
  const channelRef = useRef<BroadcastChannel | null>(null)

  useEffect(() => {
    // Check if BroadcastChannel is supported
    if (typeof BroadcastChannel !== "undefined") {
      channelRef.current = new BroadcastChannel(channelName)

      if (onMessage) {
        const handleMessage = (event: MessageEvent) => {
          onMessage(event.data)
        }

        channelRef.current.addEventListener("message", handleMessage)

        return () => {
          channelRef.current?.removeEventListener("message", handleMessage)
          channelRef.current?.close()
        }
      }
    }

    return () => {
      channelRef.current?.close()
    }
  }, [channelName, onMessage])

  const postMessage = useCallback(
    (message: BroadcastMessage) => {
      if (channelRef.current) {
        channelRef.current.postMessage(message)
      } else if (typeof BroadcastChannel !== "undefined") {
        // Create channel if it doesn't exist yet
        channelRef.current = new BroadcastChannel(channelName)
        channelRef.current.postMessage(message)
      }
    },
    [channelName],
  )

  return { postMessage }
}
