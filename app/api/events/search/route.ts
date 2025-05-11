import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const { db } = await connectToDatabase()

    // Build the search filter
    const filter: any = {}

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } },
      ]
    }

    // Add date range filter if provided
    if (startDate || endDate) {
      filter.date = {}

      if (startDate) {
        filter.date.$gte = new Date(startDate)
      }

      if (endDate) {
        filter.date.$lte = new Date(endDate)
      }
    }

    const events = await db.collection("events").find(filter).sort({ date: 1 }).toArray()

    return NextResponse.json(events)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to search events" }, { status: 500 })
  }
}
