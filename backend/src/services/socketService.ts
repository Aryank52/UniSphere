import { Server as HttpServer } from 'http'
import { Server as SocketIOServer, Socket } from 'socket.io'

let io: SocketIOServer | null = null

export interface ChatMessage {
  id: string
  senderId: number
  senderName: string
  receiverId: number
  text: string
  timestamp: string
}

const chatHistoryStore: Record<string, ChatMessage[]> = {}

export function initSocketServer(httpServer: HttpServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  })

  io.on('connection', (socket: Socket) => {
    console.log(`⚡ WebSocket client connected: ${socket.id}`)

    // Register user room
    socket.on('register_user', (userId: number) => {
      if (userId) {
        socket.join(`user:${userId}`)
        console.log(`👤 Socket ${socket.id} joined room user:${userId}`)
      }
    })

    // Register event room for live attendance tracking
    socket.on('join_event_room', (eventId: number) => {
      if (eventId) {
        socket.join(`event:${eventId}`)
        console.log(`🎟️ Socket ${socket.id} joined room event:${eventId}`)
      }
    })

    // Handle Direct Teammate Messaging
    socket.on('send_direct_message', (data: { senderId: number; senderName: string; receiverId: number; text: string }) => {
      const { senderId, senderName, receiverId, text } = data
      const roomId = [senderId, receiverId].sort().join('_')
      
      const message: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        senderId,
        senderName,
        receiverId,
        text,
        timestamp: new Date().toISOString()
      }

      if (!chatHistoryStore[roomId]) {
        chatHistoryStore[roomId] = []
      }
      chatHistoryStore[roomId].push(message)

      // Emit to sender & receiver rooms
      io?.to(`user:${senderId}`).to(`user:${receiverId}`).emit('receive_direct_message', {
        roomId,
        message
      })
    })

    // Fetch Chat History
    socket.on('get_chat_history', (data: { userId1: number; userId2: number }) => {
      const roomId = [data.userId1, data.userId2].sort().join('_')
      const history = chatHistoryStore[roomId] || []
      socket.emit('chat_history_response', { roomId, history })
    })

    socket.on('disconnect', () => {
      console.log(`⚡ WebSocket client disconnected: ${socket.id}`)
    })
  })

  return io
}

export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error('Socket.io server has not been initialized!')
  }
  return io
}

export function emitNotification(userId: number, notification: any) {
  if (io) {
    io.to(`user:${userId}`).emit('NEW_NOTIFICATION', notification)
  }
}

export function emitAttendanceCheckIn(eventId: number, data: { studentId: number; totalAttendees: number }) {
  if (io) {
    io.to(`event:${eventId}`).emit('ATTENDANCE_CHECKED_IN', data)
  }
}

export function emitTeamInvite(receiverId: number, inviteData: any) {
  if (io) {
    io.to(`user:${receiverId}`).emit('TEAM_INVITE_RECEIVED', inviteData)
  }
}
