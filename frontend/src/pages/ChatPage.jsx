import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { fetchInitialData, setCurrentChannel } from '../slices/chatSlice'
import { logout } from '../slices/authSlice'
import Header from '../components/Header'
import ChannelList from '../components/ChannelList'
import MessageArea from '../components/MessageArea'
import ChannelModal from '../components/ChannelModal'
import { ROUTES } from '../constants/routes'

const ChatPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { channels, currentChannelId, loading, error } = useSelector(
    (state) => state.chat,
  )
  const token = useSelector((state) => state.auth.token)

  useEffect(() => {
    if (!token) return
    if (channels.length === 0) {
      dispatch(fetchInitialData())
    } else if (!currentChannelId) {
      dispatch(setCurrentChannel(channels[0].id))
    }
  }, [dispatch, token, channels.length, currentChannelId, channels])

  useEffect(() => {
    if (error?.status === 401) {
      dispatch(logout())
      navigate(ROUTES.LOGIN)
    } else if (error) {
      toast.error(t('toast.loadingError'))
    }
  }, [error, dispatch, navigate, t])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{t('loading')}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="d-flex flex-column h-100">
      <Header />
      <div className="container h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row">
          <ChannelList />
          <MessageArea />
        </div>
      </div>
      <ChannelModal />
    </div>
  )
}

export default ChatPage
