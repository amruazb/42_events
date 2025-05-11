export interface Event {
  _id: string
  title: string
  description: string
  date: Date | string
  location?: string
  tags?: string[]
  featured?: boolean
}

export interface User {
  _id: string
  username: string
  password: string
  role: string
  createdAt: Date
}

export interface JWTPayload {
  userId: string
  username: string
  role: string
}
