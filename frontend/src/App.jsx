// frontend/src/App.js
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client' // импортируем напрямую

import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ChatPage from './pages/ChatPage'
import NotFoundPage from './pages/NotFoundPage'

import { addMessage } from './slices/messagesSlice'
// импорты для каналов, если нужны
// import { addChannel, removeChannel, renameChannel } from './slices/channelsSlice';

const PrivateRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token)
  return token ? children : <Navigate to="/login" />
}

function App() {
  const dispatch = useDispatch()
  const socketRef = useRef(null)

  useEffect(() => {
    // Создаём сокет-клиент (URL можно вынести в .env)
    socketRef.current = io(
      process.env.REACT_APP_SOCKET_URL || 'http://localhost:5001',
    )

    // Подписка на новые сообщения
    socketRef.current.on('newMessage', (message) => {
      console.log('New message via socket:', message)
      dispatch(addMessage(message))
    })

    // Подписка на события каналов (если используются)
    // socketRef.current.on('newChannel', (channel) => dispatch(addChannel(channel)));
    // socketRef.current.on('removeChannel', ({ id }) => dispatch(removeChannel(id)));
    // socketRef.current.on('renameChannel', (channel) => dispatch(renameChannel(channel)));

    // Отключаем сокет при размонтировании компонента
    return () => {
      socketRef.current.disconnect()
    }
  }, [dispatch]) // эффект зависит только от dispatch

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
