import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import Rollbar from 'rollbar'
import App from './App'
import store from './store'
import './i18n'
import 'react-toastify/dist/ReactToastify.css'

const rollbar = new Rollbar({
  accessToken: import.meta.env.VITE_ROLLBAR_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: import.meta.env.MODE,
  enabled: import.meta.env.PROD,
})

if (import.meta.env.DEV) {
  window.rollbar = rollbar
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    rollbar.error(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <h1>Что-то пошло не так. Мы уже работаем над этим.</h1>
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <App />
        <ToastContainer />
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>,
)
