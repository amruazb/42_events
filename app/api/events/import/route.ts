import { NextRequest, NextResponse } from "next/server"
import { parse } from "csv-parse/sync"
import { writeFile } from "fs/promises"
import { join } from "path"
import { mkdir } from "fs/promises"
import { existsSync } from "fs"
import { dbConnect } from "@/lib/db"
import { Event } from "@/lib/models/event"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const csvFile = formData.get("csv") as File
    const mediaFiles = formData.getAll("media") as File[]

    if (!csvFile) {
      return NextResponse.json(
        { error: "No CSV file provided" },
        { status: 400 }
      )
    }

    // Read and parse CSV
    const csvText = await csvFile.text()
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
    })

    // Create media directory if it doesn't exist
    const mediaDir = join(process.cwd(), "public", "media")
    if (!existsSync(mediaDir)) {
      await mkdir(mediaDir, { recursive: true })
    }

    // Save media files
    const mediaUrls: { [key: string]: string } = {}
    for (const file of mediaFiles) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const filename = file.name
      const filepath = join(mediaDir, filename)
      await writeFile(filepath, buffer)
      mediaUrls[filename] = `/media/${filename}`
    }

    // Connect to database
    await dbConnect()

    // Process each record
    const events = await Promise.all(
      records.map(async (record: any) => {
        // Map CSV columns to event fields
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
          image: record.image ? mediaUrls[record.image] : undefined,
          capacity: parseInt(record.capacity) || undefined,
        }

        // Create event in database
        return Event.create(event)
      })
    )

    return NextResponse.json({
      message: "Events imported successfully",
      count: events.length,
    })
  } catch (error) {
    console.error("Error importing events:", error)
    return NextResponse.json(
      { error: "Failed to import events" },
      { status: 500 }
    )
  }
}
