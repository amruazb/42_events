import { seedUsers } from "@/lib/auth"
import { NextResponse } from "next/server"

// This will be called when the app starts
let seeded = false

export async function GET() {
  if (!seeded) {
    await seedUsers().catch(console.error)
    seeded = true
  }
  return NextResponse.json({ message: "Seeding initialized" })
}
