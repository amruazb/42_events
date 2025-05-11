import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const data = await request.json()

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: "Invalid data format. Expected an array of events." }, { status: 400 })
    }

    // Validate each event
    const validEvents = data.filter((event) => {
      return event.title && event.description && event.date
    })

    if (validEvents.length === 0) {
      return NextResponse.json(
        { error: "No valid events found. Each event must have title, description, and date." },
        { status: 400 },
      )
    }

    // Convert date strings to Date objects
    const eventsWithDates = validEvents.map((event) => ({
      ...event,
      date: new Date(event.date),
    }))

    const result = await db.collection("events").insertMany(eventsWithDates)

    return NextResponse.json(
      {
        success: true,
        insertedCount: result.insertedCount,
        insertedIds: result.insertedIds,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to import events" }, { status: 500 })
  }
}
