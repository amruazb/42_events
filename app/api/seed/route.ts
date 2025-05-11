import { NextResponse } from "next/server"
import { seedAdminUser } from "@/lib/auth"

export async function GET() {
  try {
    await seedAdminUser()
    return NextResponse.json({ success: true, message: "Admin user seeded successfully" })
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json({ error: "Failed to seed admin user" }, { status: 500 })
  }
}
