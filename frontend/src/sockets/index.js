import { io } from 'socket.io-client'

class SocketManager {
  constructor() {
    this.socket = null
  }

  connect(token) {
    this.socket = io({
      auth: { token },
    })
    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback)
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback)
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data)
    }
  }
}

export default new SocketManager()
