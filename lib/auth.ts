import { connectToDatabase } from "./mongodb"
import { compare, hash } from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import type { User, JWTPayload } from "./types"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const SALT_ROUNDS = 10

export async function createUser(username: string, password: string, role = "user"): Promise<User> {
  const { db } = await connectToDatabase()

  // Check if user already exists
  const existingUser = await db.collection("users").findOne({ username })
  if (existingUser) {
    throw new Error("User already exists")
  }

  // Hash the password
  const hashedPassword = await hash(password, SALT_ROUNDS)

  // Create the user
  const result = await db.collection("users").insertOne({
    username,
    password: hashedPassword,
    role,
    createdAt: new Date(),
  })

  return {
    _id: result.insertedId.toString(),
    username,
    password: hashedPassword,
    role,
    createdAt: new Date(),
  }
}

export async function validateUser(username: string, password: string): Promise<User | null> {
  const { db } = await connectToDatabase()

  // Find the user
  const user = await db.collection("users").findOne({ username })
  if (!user) {
    return null
  }

  // Validate password
  const isValid = await compare(password, user.password)
  if (!isValid) {
    return null
  }

  return user as unknown as User
}

export async function generateToken(user: User): Promise<string> {
  const payload: JWTPayload = {
    userId: user._id.toString(),
    username: user.username,
    role: user.role,
  }

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(JWT_SECRET))

  return token
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    return payload as JWTPayload
  } catch (error) {
    return null
  }
}

export async function seedAdminUser() {
  try {
    const { db } = await connectToDatabase()

    // Check if admin user exists
    const adminExists = await db.collection("users").findOne({ username: "admin" })

    if (!adminExists) {
      await createUser("admin", "admin", "admin")
      console.log("Admin user created")
    }
  } catch (error) {
    console.error("Error seeding admin user:", error)
  }
}
