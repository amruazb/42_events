import type { NextRequest } from "next/server"
import { Server } from "socket.io"
import { createServer } from "http"
import type { NextApiResponseServerIO } from "@/types/socket"

export async function GET(req: NextRequest) {
  if (!req.headers.get("upgrade")?.includes("websocket")) {
    return new Response("Expected Upgrade: websocket", { status: 426 })
  }

  // Create a new HTTP server
  const httpServer = createServer()

  // Create a new Socket.IO server
  const io = new Server(httpServer, {
    path: "/api/socket",
    addTrailingSlash: false,
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  })

  // Socket.IO event handlers
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id)

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id)
    })

    // Join admin room for admin-only events
    socket.on("join:admin", () => {
      socket.join("admin")
    })

    // Custom event handlers
    socket.on("event:create", (data) => {
      io.emit("event:created", data)
    })

    socket.on("event:update", (data) => {
      io.emit("event:updated", data)
    })

    socket.on("event:delete", (data) => {
      io.emit("event:deleted", data)
    })
  })

  // Store the Socket.IO server in the response object
  const res = new Response()
  ;(res as unknown as NextApiResponseServerIO).socket = io

  return res
}
