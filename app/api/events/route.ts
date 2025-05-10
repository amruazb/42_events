import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import dbConnect from "@/lib/db"
import Event from "@/lib/models/event"
import { authOptions } from "@/lib/auth"
import { z } from "zod"

// Validation schema for event data
const EventSchema = z.object({
  title: z.object({
    en: z.string().min(1, "English title is required"),
    ar: z.string().min(1, "Arabic title is required"),
    fr: z.string().min(1, "French title is required"),
  }),
  description: z.object({
    en: z.string().min(1, "English description is required"),
    ar: z.string().min(1, "Arabic description is required"),
    fr: z.string().min(1, "French description is required"),
  }),
  location: z.object({
    en: z.string().min(1, "English location is required"),
    ar: z.string().min(1, "Arabic location is required"),
    fr: z.string().min(1, "French location is required"),
  }),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)),
  category: z.string().min(1, "Category is required"),
  image: z.string().optional(),
  capacity: z.number().optional(),
})

// GET /api/events - Get all events
export async function GET(req: NextRequest) {
  try {
    const db = await dbConnect()

    // If database connection failed, return error
    if (!db) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(req.url)
    const limit = searchParams.get("limit")
      ? Number.parseInt(searchParams.get("limit") as string)
      : undefined
    const upcoming = searchParams.get("upcoming") === "true"
    const category = searchParams.get("category")

    // Validate parameters
    if (limit && (isNaN(limit) || limit < 1)) {
      return NextResponse.json(
        { error: "Invalid limit parameter" },
        { status: 400 }
      )
    }

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
    return NextResponse.json(JSON.parse(JSON.stringify(events)))
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/events - Create a new event
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const db = await dbConnect()

    // If database connection failed, return error
    if (!db) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 503 }
      )
    }

    const data = await req.json()

    // Validate event data
    try {
      const validatedData = EventSchema.parse(data)
      
      // Additional validation: endDate must be after startDate
      if (validatedData.endDate <= validatedData.startDate) {
        return NextResponse.json(
          { error: "End date must be after start date" },
          { status: 400 }
        )
      }

      const event = await Event.create(validatedData)
      return NextResponse.json(event, { status: 201 })
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Validation error", details: validationError.errors },
          { status: 400 }
        )
      }
      throw validationError
    }
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
