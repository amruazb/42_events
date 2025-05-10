import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get campus ID from query params or default to 39 (Abu Dhabi)
    const { searchParams } = new URL(req.url)
    const campusId = searchParams.get("campus") || "39"

    // Fetch events from 42 API
    const response = await fetch(`https://api.intra.42.fr/v2/campus/${campusId}/events`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch events from 42 API: ${response.statusText}`)
    }

    const events = await response.json()

    return NextResponse.json(events)
  } catch (error) {
    console.error("Error fetching 42 events:", error)
    return NextResponse.json({ error: "Failed to fetch events from 42 API" }, { status: 500 })
  }
}
