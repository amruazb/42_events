"use client"

import { useEffect } from "react"

export function SeedClient() {
  useEffect(() => {
    // Call the seed endpoint when the app loads
    fetch("/api/seed-init").catch(console.error)
  }, [])

  return null
}
