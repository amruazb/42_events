import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { parse } from "csv-parse/sync"
import dbConnect from "@/lib/db"
import Event from "@/lib/models/event"
import { authOptions } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse form data
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Read file content
    const fileContent = await file.text()

    // Parse CSV
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    })

    if (!records.length) {
      return NextResponse.json({ error: "No records found in CSV" }, { status: 400 })
    }

    await dbConnect()

    // Process and save events
    const events = []

    for (const record of records) {
      const event = {
        title: {
          en: record.title_en,
          ar: record.title_ar,
          fr: record.title_fr,
        },
        description: {
          en: record.description_en,
          ar: record.description_ar,
          fr: record.description_fr,
        },
        location: {
          en: record.location_en,
          ar: record.location_ar,
          fr: record.location_fr,
        },
        startDate: new Date(record.startDate),
        endDate: new Date(record.endDate),
        category: record.category,
        image: record.image || undefined,
        capacity: record.capacity ? Number.parseInt(record.capacity) : undefined,
      }

      events.push(event)
    }

    // Insert events
    const result = await Event.insertMany(events)

    // Emit socket events for real-time updates
    // This would be handled by a separate socket service

    return NextResponse.json({ success: true, imported: result.length })
  } catch (error) {
    console.error("Error importing events:", error)
    return NextResponse.json({ error: "Failed to import events" }, { status: 500 })
  }
}
