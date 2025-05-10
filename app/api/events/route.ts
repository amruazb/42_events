import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import dbConnect from "@/lib/db"
import Event from "@/lib/models/event"
import { authOptions } from "@/lib/auth"

// GET /api/events - Get all events
export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(req.url)
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit") as string) : undefined
    const upcoming = searchParams.get("upcoming") === "true"
    const category = searchParams.get("category")

    // Build query
    const query: any = {}

    if (upcoming) {
      query.startDate = { $gte: new Date() }
    }

    if (category) {
      query.category = category
    }

    // Get events
    let eventsQuery = Event.find(query)

    // Sort by date
    eventsQuery = eventsQuery.sort({ startDate: upcoming ? 1 : -1 })

    // Apply limit
    if (limit) {
      eventsQuery = eventsQuery.limit(limit)
    }

    const events = await eventsQuery.exec()

    return NextResponse.json(events)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

// POST /api/events - Create a new event
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const data = await req.json()
    const event = await Event.create(data)

    // Emit socket event for real-time updates
    // This would be handled by a separate socket service

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
