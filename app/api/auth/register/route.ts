import { NextResponse } from "next/server"
import { createUser, generateToken } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    // Create user with default role "user"
    const user = await createUser(username, password)

    const token = generateToken(user)

    return NextResponse.json(
      {
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
        },
        token,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Registration error:", error)

    if (error.message === "User already exists") {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 })
    }

    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
