import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { useEffect, useState } from 'react'
import i18n, { initPromise } from './i18n'
import { AuthProvider } from './contexts/AuthContext'
import { SocketProvider } from './sockets/SocketContext'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ChatPage from './pages/ChatPage'
import NotFoundPage from './pages/NotFoundPage'
import { ROUTES } from './constants/routes'

const PrivateRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token)
  return token ? children : <Navigate to={ROUTES.LOGIN} />
}

const App = () => {
  const [i18nReady, setI18nReady] = useState(false)

  useEffect(() => {
    initPromise.then(() => setI18nReady(true))
  }, [])

  if (!i18nReady) {
    return <div>Loading...</div>
  }

  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <SocketProvider>
          <BrowserRouter>
            <Routes>
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />
              <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
              <Route
                path={ROUTES.HOME}
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
    </I18nextProvider>
  )
}

export default App
