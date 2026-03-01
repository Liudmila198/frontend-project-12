import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Modal, Button } from 'react-bootstrap'

import {
  fetchInitialData,
  setCurrentChannel,
  sendMessage,
  addMessage,
  addChannel,
  removeChannelAction,
  renameChannelAction,
  createChannel,
  renameChannel,
  removeChannel,
} from '../slices/chatSlice'
import { logout } from '../slices/authSlice'
import socketManager from '../sockets'
import Header from '../components/Header'

const ChatPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { channels, messages, currentChannelId, loading, error, sending }
    = useSelector(state => state.chat)
  const token = useSelector(state => state.auth.token)
  const username = useSelector(state => state.auth.username)

  const [showAddChannel, setShowAddChannel] = useState(false)
  const [showRenameChannel, setShowRenameChannel] = useState(false)
  const [showRemoveChannel, setShowRemoveChannel] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState(null)

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    const socket = socketManager.connect(token)

    socket.on('newMessage', (message) => {
      dispatch(addMessage(message))
    })

    socket.on('newChannel', (channel) => {
      dispatch(addChannel(channel))
    })

    socket.on('removeChannel', (channel) => {
      dispatch(removeChannelAction(channel.id))
    })

    socket.on('renameChannel', (channel) => {
      dispatch(renameChannelAction(channel))
    })

    return () => {
      socketManager.disconnect()
    }
  }, [token, dispatch, navigate])

  useEffect(() => {
    if (!token) return
    if (channels.length === 0) {
      dispatch(fetchInitialData())
    }
  }, [dispatch, token, channels.length])

  useEffect(() => {
    if (error && error.status === 401) {
      dispatch(logout())
      navigate('/login')
    }
    else if (error) {
      toast.error(t('toast.loadingError'))
    }
  }, [error, dispatch, navigate, t])

  const handleChannelSelect = (channelId) => {
    dispatch(setCurrentChannel(channelId))
  }

  const currentChannel = channels.find(c => c.id === currentChannelId)

  const filteredMessages = messages.filter(
    msg => msg.channelId === currentChannelId,
  )

  const handleSubmitMessage = async (values, { resetForm }) => {
    if (!currentChannelId) {
      return
    }
    try {
      await dispatch(
        sendMessage({
          text: values.message,
          channelId: currentChannelId,
          username,
        }),
      ).unwrap()
      resetForm()
    }
    catch {
      toast.error(t('toast.messageError'))
    }
  }

  const openAddChannel = () => setShowAddChannel(true)
  const closeAddChannel = () => setShowAddChannel(false)

  const openRenameChannel = (channel) => {
    setSelectedChannel(channel)
    setShowRenameChannel(true)
  }
  const closeRenameChannel = () => {
    setSelectedChannel(null)
    setShowRenameChannel(false)
  }

  const openRemoveChannel = (channel) => {
    setSelectedChannel(channel)
    setShowRemoveChannel(true)
  }
  const closeRemoveChannel = () => {
    setSelectedChannel(null)
    setShowRemoveChannel(false)
  }

  const validateChannelName = (name, currentId = null) => {
    const existing = channels.find(
      c => c.name === name && (currentId === null || c.id !== currentId),
    )
    return !existing
  }

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
          {/* Список каналов */}
          <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
            <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
              <b>{t('chat.channels')}</b>
              <button
                type="button"
                onClick={openAddChannel}
                className="p-0 text-primary btn btn-group-vertical"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  width="20"
                  height="20"
                  fill="currentColor"
                >
                  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                </svg>
                <span className="visually-hidden">+</span>
              </button>
            </div>
            <ul
              id="channels-box"
              className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
            >
              {channels.map(channel => (
                <li key={channel.id} className="nav-item w-100">
                  {channel.removable === false
                    ? (
                      <button
                        type="button"
                        className={`w-100 rounded-1 text-start btn ${currentChannelId === channel.id ? 'btn-secondary' : 'btn-light'}`}
                        onClick={() => handleChannelSelect(channel.id)}
                      >
                        <span className="me-1">#</span>
                        {channel.name}
                      </button>
                    )
                    : (
                      <div className="d-flex dropdown btn-group">
                        <button
                          type="button"
                          className={`w-100 rounded-1 text-start text-truncate btn ${currentChannelId === channel.id ? 'btn-secondary' : 'btn-light'}`}
                          onClick={() => handleChannelSelect(channel.id)}
                        >
                          <span className="me-1">#</span>
                          {channel.name}
                        </button>
                        <button
                          type="button"
                          className={`flex-grow-0 dropdown-toggle dropdown-toggle-split btn ${currentChannelId === channel.id ? 'btn-secondary' : 'btn-light'}`}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <span className="visually-hidden">
                            {t('channel.actions')}
                          </span>
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={() => openRenameChannel(channel)}
                            >
                              {t('channel.rename')}
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              className="dropdown-item text-danger"
                              onClick={() => openRemoveChannel(channel)}
                            >
                              {t('channel.remove')}
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                </li>
              ))}
            </ul>
          </div>

          {/* Область сообщений */}
          <div className="col p-0 h-100">
            <div className="d-flex flex-column h-100">
              <div className="bg-light mb-4 p-3 shadow-sm small">
                <p className="m-0">
                  <b>
                    #
                    {' '}
                    {currentChannel?.name}
                  </b>
                </p>
                <span className="text-muted">
                  {filteredMessages.length}
                  {' '}
                  сообщений
                </span>
              </div>

              <div
                id="messages-box"
                className="chat-messages overflow-auto px-5"
              >
                {filteredMessages.map(msg => (
                  <div key={msg.id} className="text-break mb-2">
                    <b>{msg.username}</b>
                    {': '}
                    {msg.text}
                  </div>
                ))}
              </div>

              <div className="mt-auto px-5 py-3">
                <Formik
                  initialValues={{ message: '' }}
                  validationSchema={Yup.object({
                    message: Yup.string().required(t('validation.required')),
                  })}
                  onSubmit={handleSubmitMessage}
                >
                  {({ isSubmitting }) => (
                    <Form className="py-1 border rounded-2">
                      <div className="input-group has-validation">
                        <Field
                          name="message"
                          className="border-0 p-0 ps-2 form-control"
                          placeholder={t('chat.typeMessage')}
                          disabled={sending}
                          aria-label="Новое сообщение"
                        />
                        <button
                          type="submit"
                          disabled={isSubmitting || sending}
                          className="btn btn-group-vertical"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            width="20"
                            height="20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"
                            />
                          </svg>
                          <span className="visually-hidden">{t('send')}</span>
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно добавления канала */}
      <Modal show={showAddChannel} onHide={closeAddChannel}>
        <Modal.Header closeButton>
          <Modal.Title>{t('modal.addChannel')}</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{ name: '' }}
          validationSchema={Yup.object({
            name: Yup.string()
              .min(3, t('validation.channelNameLength'))
              .max(20, t('validation.channelNameLength'))
              .required(t('validation.required'))
              .test('unique', t('validation.channelNameUnique'), value =>
                validateChannelName(value),
              ),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await dispatch(createChannel(values.name)).unwrap()
              toast.success(t('toast.channelCreated'))
              closeAddChannel()
            }
            catch {
              toast.error(t('toast.error'))
            }
            finally {
              setSubmitting(false)
            }
          }}
        >
          {({
            handleSubmit,
            handleChange,
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit}>
              <Modal.Body>
                <div className="form-floating">
                  <input
                    id="channel-name-input"
                    name="name"
                    className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
                    placeholder={t('channel.name')}
                    value={values.name}
                    onChange={handleChange}
                    autoFocus
                  />
                  <label htmlFor="channel-name-input">
                    {t('channel.name')}
                  </label>
                  {touched.name && errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={closeAddChannel}>
                  {t('cancel')}
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? t('loading') : t('add')}
                </Button>
              </Modal.Footer>
            </form>
          )}
        </Formik>
      </Modal>

      {/* Модальное окно переименования канала */}
      <Modal show={showRenameChannel} onHide={closeRenameChannel}>
        <Modal.Header closeButton>
          <Modal.Title>{t('modal.renameChannel')}</Modal.Title>
        </Modal.Header>
        {selectedChannel && (
          <Formik
            initialValues={{ name: selectedChannel.name }}
            validationSchema={Yup.object({
              name: Yup.string()
                .min(3, t('validation.channelNameLength'))
                .max(20, t('validation.channelNameLength'))
                .required(t('validation.required'))
                .test('unique', t('validation.channelNameUnique'), value =>
                  validateChannelName(value, selectedChannel.id),
                ),
            })}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await dispatch(
                  renameChannel({ id: selectedChannel.id, name: values.name }),
                ).unwrap()
                toast.success(t('toast.channelRenamed'))
                closeRenameChannel()
              }
              catch {
                toast.error(t('toast.error'))
              }
              finally {
                setSubmitting(false)
              }
            }}
          >
            {({
              handleSubmit,
              handleChange,
              values,
              errors,
              touched,
              isSubmitting,
            }) => (
              <form onSubmit={handleSubmit}>
                <Modal.Body>
                  <div className="form-floating">
                    <input
                      id="rename-channel-input"
                      name="name"
                      className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
                      placeholder={t('channel.name')}
                      value={values.name}
                      onChange={handleChange}
                      autoFocus
                    />
                    <label htmlFor="rename-channel-input">
                      {t('channel.name')}
                    </label>
                    {touched.name && errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={closeRenameChannel}>
                    {t('cancel')}
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('loading') : t('rename')}
                  </Button>
                </Modal.Footer>
              </form>
            )}
          </Formik>
        )}
      </Modal>

      {/* Модальное окно удаления канала */}
      <Modal show={showRemoveChannel} onHide={closeRemoveChannel}>
        <Modal.Header closeButton>
          <Modal.Title>{t('modal.removeChannel')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t('channel.removeConfirmText')}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeRemoveChannel}>
            {t('cancel')}
          </Button>
          <Button
            variant="danger"
            onClick={async () => {
              try {
                await dispatch(removeChannel(selectedChannel.id)).unwrap()
                toast.success(t('toast.channelRemoved'))
                closeRemoveChannel()
              }
              catch {
                toast.error(t('toast.error'))
              }
            }}
          >
            {t('delete')}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ChatPage
