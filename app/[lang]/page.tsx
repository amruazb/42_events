import { Suspense } from "react"
import { getEvents } from "@/lib/api/events"
import { HomeContent } from "@/components/home-content"

export default async function Home({
  params: { lang },
}: {
  params: { lang: string }
}) {
  // Get upcoming events
  const events = await getEvents({ limit: 6, upcoming: true })

  return <HomeContent lang={lang} initialEvents={events} />
} 