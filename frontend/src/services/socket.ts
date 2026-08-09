import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    socket = io('/', {
      autoConnect: true,
      transports: ['websocket', 'polling']
    })

    socket.on('connect', () => {
      console.log('⚡ Socket.io connected to server:', socket?.id)
    })

    socket.on('disconnect', () => {
      console.log('⚡ Socket.io disconnected from server')
    })
  }

  return socket
}

export function registerSocketUser(userId: number) {
  const s = getSocket()
  if (s && userId) {
    s.emit('register_user', userId)
  }
}

export function joinEventSocketRoom(eventId: number) {
  const s = getSocket()
  if (s && eventId) {
    s.emit('join_event_room', eventId)
  }
}
