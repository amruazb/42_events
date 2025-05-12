import { connectToDatabase } from "./mongodb"
import { ObjectId } from "mongodb"
import type { Event } from "./types"

export async function getAllEvents(): Promise<Event[]> {
  const { db } = await connectToDatabase()
  return db.collection("events").find({}).sort({ date: 1 }).toArray()
}

export async function getEventById(id: string): Promise<Event | null> {
  if (!ObjectId.isValid(id)) {
    return null
  }

  const { db } = await connectToDatabase()
  return db.collection("events").findOne({ _id: new ObjectId(id) })
}

export async function searchEvents(query: string): Promise<Event[]> {
  const { db } = await connectToDatabase()

  const filter = {
    $or: [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { location: { $regex: query, $options: "i" } },
    ],
  }

  return db.collection("events").find(filter).sort({ date: 1 }).toArray()
}

export async function createEvent(eventData: Omit<Event, "_id">): Promise<Event> {
  const { db } = await connectToDatabase()

  // Ensure date is a Date object
  const data = {
    ...eventData,
    date: new Date(eventData.date),
  }

  const result = await db.collection("events").insertOne(data)

  return {
    _id: result.insertedId.toString(),
    ...data,
  }
}

export async function updateEvent(id: string, eventData: Partial<Event>): Promise<Event | null> {
  if (!ObjectId.isValid(id)) {
    return null
  }

  const { db } = await connectToDatabase()

  // Ensure date is a Date object if provided
  const data = {
    ...eventData,
  }

  if (eventData.date) {
    data.date = new Date(eventData.date)
  }

  await db.collection("events").updateOne({ _id: new ObjectId(id) }, { $set: data })

  return getEventById(id)
}

export async function deleteEvent(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) {
    return false
  }

  const { db } = await connectToDatabase()

  const result = await db.collection("events").deleteOne({ _id: new ObjectId(id) })

  return result.deletedCount === 1
}
