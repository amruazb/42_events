import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

// Move JWT verification to middleware without importing MongoDB
async function verifyToken(token: string) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    return payload
  } catch (error) {
    return null
  }
}

export async function middleware(request: NextRequest) {
  // Check if the request is for the admin area
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Skip middleware for login pages
    if (
      request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/login/admin" ||
      request.nextUrl.pathname === "/login/user"
    ) {
      return NextResponse.next()
    }

    // Get the token from cookies
    const token = request.cookies.get("auth-token")?.value

    // If there's no token, redirect to admin login page
    if (!token) {
      return NextResponse.redirect(new URL("/login/admin", request.url))
    }

    // If there is a token, verify it
    const payload = await verifyToken(token)

    if (!payload || payload.role !== "admin") {
      // Invalid token or not an admin, redirect to admin login page
      return NextResponse.redirect(new URL("/login/admin", request.url))
    }
  }

  // For API routes that need protection
  if (request.nextUrl.pathname.startsWith("/api/admin")) {
    // Get the token from the Authorization header
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const payload = await verifyToken(token)

    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  }

  // Check if the request is for protected user routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    // Get the token from cookies
    const token = request.cookies.get("auth-token")?.value

    // If there's no token, redirect to user login page
    if (!token) {
      return NextResponse.redirect(new URL("/login/user", request.url))
    }

    // If there is a token, verify it
    const payload = await verifyToken(token)

    if (!payload) {
      // Invalid token, redirect to user login page
      return NextResponse.redirect(new URL("/login/user", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/dashboard/:path*"],
}
