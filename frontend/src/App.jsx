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
import { AuthProvider } from './contexts/AuthContext'
import { SocketProvider } from './sockets/SocketContext' // если есть
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
    <AuthProvider>
      <SocketProvider> {/* опционально */}
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
    </AuthProvider>
  )
}

export default App
