import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

// Only throw error in production runtime, not during build
if (!MONGODB_URI && process.env.NODE_ENV === "production" && !process.env.VERCEL_ENV) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  // Return early if no MongoDB URI is defined (during build)
  if (!MONGODB_URI) {
    console.warn("MongoDB URI not defined. Database connection skipped.")
    return null
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      ssl: true,
      sslValidate: true,
      retryWrites: true,
      retryReads: true,
    }

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log("MongoDB connected successfully")
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error("MongoDB connection error:", e)
    throw e
  }

  return cached.conn
}

// Handle connection errors
mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error)
  cached.promise = null
  cached.conn = null
})

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected")
  cached.promise = null
  cached.conn = null
})

export default dbConnect
