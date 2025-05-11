import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { sampleEvents } from "@/lib/sample-data"

// Seed admin user is now handled by the /api/seed endpoint

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Check if events collection has data
    const count = await db.collection("events").countDocuments()

    // If no events exist, seed with sample data
    if (count === 0) {
      await db.collection("events").insertMany(sampleEvents)
    }

    const events = await db.collection("events").find({}).sort({ date: 1 }).toArray()

    return NextResponse.json(events)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.description || !data.date) {
      return NextResponse.json({ error: "Title, description, and date are required" }, { status: 400 })
    }

    // Ensure date is a valid Date object
    data.date = new Date(data.date)

    const result = await db.collection("events").insertOne(data)

    return NextResponse.json(
      {
        _id: result.insertedId,
        ...data,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
