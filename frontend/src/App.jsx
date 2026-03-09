// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// import { useSelector } from 'react-redux'
// import LoginPage from './pages/LoginPage'
// import SignupPage from './pages/SignupPage'
// import ChatPage from './pages/ChatPage'
// import NotFoundPage from './pages/NotFoundPage'

// const PrivateRoute = ({ children }) => {
//   const token = useSelector(state => state.auth.token)
//   return token ? children : <Navigate to="/login" />
// }

// const App = () => {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/signup" element={<SignupPage />} />
//         <Route
//           path="/"
//           element={(
//             <PrivateRoute>
//               <ChatPage />
//             </PrivateRoute>
//           )}
//         />
//         <Route path="*" element={<NotFoundPage />} />
//       </Routes>
//     </BrowserRouter>
//   )
// }

// export default App

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { SocketProvider } from './sockets/SocketContext' // импортируем провайдер
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ChatPage from './pages/ChatPage'
import NotFoundPage from './pages/NotFoundPage'

const PrivateRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token)
  return token ? children : <Navigate to="/login" />
}

const App = () => {
  return (
    <SocketProvider>
      {' '}
      {/* Оборачиваем роутер, чтобы контекст был доступен во всех страницах */}
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
    </SocketProvider>
  )
}

export default App
