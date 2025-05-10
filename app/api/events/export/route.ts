import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { stringify } from "csv-stringify/sync"
import { createEvents } from "ics"
import dbConnect from "@/lib/db"
import Event from "@/lib/models/event"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const format = searchParams.get("format") || "csv"

    await dbConnect()

    // Get all events
    const events = await Event.find().sort({ startDate: 1 })

    if (format === "csv") {
      // Convert to CSV format
      const csvData = events.map((event) => ({
        title_en: event.title.en,
        title_ar: event.title.ar,
        title_fr: event.title.fr,
        description_en: event.description.en,
        description_ar: event.description.ar,
        description_fr: event.description.fr,
        location_en: event.location.en,
        location_ar: event.location.ar,
        location_fr: event.location.fr,
        startDate: event.startDate.toISOString(),
        endDate: event.endDate.toISOString(),
        category: event.category,
        image: event.image || "",
        capacity: event.capacity || "",
      }))

      const csv = stringify(csvData, { header: true })

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="42-events-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      })
    } else if (format === "ics") {
      // Convert to ICS format
      const icsEvents = events.map((event) => {
        const startDate = new Date(event.startDate)
        const endDate = new Date(event.endDate)

        return {
          title: event.title.en,
          description: event.description.en,
          location: event.location.en,
          start: [
            startDate.getFullYear(),
            startDate.getMonth() + 1,
            startDate.getDate(),
            startDate.getHours(),
            startDate.getMinutes(),
          ],
          end: [
            endDate.getFullYear(),
            endDate.getMonth() + 1,
            endDate.getDate(),
            endDate.getHours(),
            endDate.getMinutes(),
          ],
          categories: [event.category],
        }
      })

      const { error, value } = createEvents(icsEvents)

      if (error) {
        throw new Error("Failed to create ICS file")
      }

      return new NextResponse(value, {
        headers: {
          "Content-Type": "text/calendar",
          "Content-Disposition": `attachment; filename="42-events-${new Date().toISOString().split("T")[0]}.ics"`,
        },
      })
    } else {
      return NextResponse.json({ error: "Unsupported format" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error exporting events:", error)
    return NextResponse.json({ error: "Failed to export events" }, { status: 500 })
  }
}
