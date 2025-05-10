import dbConnect from "@/lib/db"
import Event from "@/lib/models/event"

interface GetEventsOptions {
  limit?: number
  upcoming?: boolean
  category?: string
}

// Get events with options
export async function getEvents(options: GetEventsOptions = {}) {
  try {
    await dbConnect()

    const { limit, upcoming, category } = options

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

    const events = await eventsQuery.lean()

    // Convert MongoDB documents to plain objects and handle dates
    return JSON.parse(JSON.stringify(events))
  } catch (error) {
    console.error("Error fetching events:", error)
    return []
  }
}

// Get a single event by ID
export async function getEvent(id: string) {
  try {
    await dbConnect()

    const event = await Event.findById(id).lean()

    if (!event) {
      return null
    }

    // Convert MongoDB document to plain object and handle dates
    return JSON.parse(JSON.stringify(event))
  } catch (error) {
    console.error("Error fetching event:", error)
    return null
  }
}
