import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

interface Cached {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongoose: Cached | undefined
}

let cached: Cached = global.mongoose || { conn: null, promise: null }

if (!global.mongoose) {
  global.mongoose = cached
}

async function dbConnect() {
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

    try {
      cached.promise = mongoose.connect(MONGODB_URI, opts)
      console.log("MongoDB connected successfully")
    } catch (error) {
      cached.promise = null
      console.error("MongoDB connection error:", error)
      throw error
    }
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
