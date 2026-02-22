import { io } from 'socket.io-client'

const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001'

class SocketManager {
  constructor() {
    this.socket = null
  }

  connect(token) {
    if (this.socket) return this.socket
    this.socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket'],
    })
    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }
}

const socketManager = new SocketManager()
export default socketManager
