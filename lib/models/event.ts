import mongoose, { Schema, type Document } from "mongoose"

export interface IEvent extends Document {
  title: {
    en: string
    ar: string
    fr: string
  }
  description: {
    en: string
    ar: string
    fr: string
  }
  location: {
    en: string
    ar: string
    fr: string
  }
  startDate: Date
  endDate: Date
  category: string
  image?: string
  capacity?: number
  registrations?: number
  createdAt: Date
  updatedAt: Date
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
      fr: { type: String, required: true },
    },
    description: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
      fr: { type: String, required: true },
    },
    location: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
      fr: { type: String, required: true },
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    category: { type: String, required: true },
    image: { type: String },
    capacity: { type: Number },
    registrations: { type: Number, default: 0 },
  },
  { timestamps: true },
)

// Create indexes for better search performance
EventSchema.index({ "title.en": "text", "title.ar": "text", "title.fr": "text" })
EventSchema.index({ startDate: 1 })
EventSchema.index({ category: 1 })

export default mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema)
