import { io } from 'socket.io-client'

const socket = io('http://localhost:5001') // по умолчанию подключается к тому же хосту, что и фронт

export default socket
