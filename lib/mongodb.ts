import { MongoClient } from "mongodb"
import "server-only"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://admin:admin@localhost:27017/events"
const MONGODB_DB = process.env.MONGODB_DB || "events"

// Cache the MongoDB connection to reuse it across requests
let cachedClient: MongoClient | null = null
let cachedDb: any = null

export async function connectToDatabase() {
  // If we have the cached connection, use it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  // Create a new MongoDB connection
  const client = new MongoClient(MONGODB_URI)
  await client.connect()
  const db = client.db(MONGODB_DB)

  // Cache the connection
  cachedClient = client
  cachedDb = db

  return { client, db }
}
