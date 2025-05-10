import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import dbConnect from "@/lib/db"
import Event from "@/lib/models/event"
import { authOptions } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { events } = await req.json()

    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ error: "No events provided" }, { status: 400 })
    }

    await dbConnect()

    // Process and save events
    const formattedEvents = events.map((event: any) => ({
      title: {
        en: event.name || "",
        ar: event.name || "", // Would need translation
        fr: event.name || "", // Would need translation
      },
      description: {
        en: event.description || "",
        ar: event.description || "", // Would need translation
        fr: event.description || "", // Would need translation
      },
      location: {
        en: event.location || "",
        ar: event.location || "", // Would need translation
        fr: event.location || "", // Would need translation
      },
      startDate: new Date(event.begin_at),
      endDate: new Date(event.end_at),
      category: event.kind || "other",
      image: event.poster || "",
      capacity: event.max_people || 50,
    }))

    // Insert events
    const result = await Event.insertMany(formattedEvents)

    return NextResponse.json({ success: true, imported: result.length })
  } catch (error) {
    console.error("Error importing 42 events:", error)
    return NextResponse.json({ error: "Failed to import events from 42 API" }, { status: 500 })
  }
}
