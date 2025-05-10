import mongoose, { Schema, type Document } from "mongoose"

export interface IUser extends Document {
  fortytwoId: string
  email: string
  username: string
  displayName: string
  avatar: string
  isAdmin: boolean
  accessToken: string
  refreshToken: string
  tokenExpiry: Date
  lastLogin: Date
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    fortytwoId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    displayName: { type: String, required: true },
    avatar: { type: String },
    isAdmin: { type: Boolean, default: false },
    accessToken: { type: String },
    refreshToken: { type: String },
    tokenExpiry: { type: Date },
    lastLogin: { type: Date },
  },
  { timestamps: true },
)

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
