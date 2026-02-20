import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';

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
} from '../slices/chatSlice';
import { logout } from '../slices/authSlice';
import socketManager from '../sockets';
import Header from '../components/Header';

const ChatPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    channels,
    messages,
    currentChannelId,
    loading,
    error,
    sending,
  } = useSelector((state) => state.chat);
  const token = useSelector((state) => state.auth.token);

  const [showAddChannel, setShowAddChannel] = useState(false);
  const [showRenameChannel, setShowRenameChannel] = useState(false);
  const [showRemoveChannel, setShowRemoveChannel] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);

  // Логирование текущего канала при его изменении
  useEffect(() => {
    console.log('Current channel ID changed to:', currentChannelId);
  }, [currentChannelId]);

  // Подключение к сокетам
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const socket = socketManager.connect(token);

    socket.on('connect', () => {
      console.log('Socket connected for user');
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    socket.on('newMessage', (message) => {
      console.log('New message via socket:', message, 'current channel:', currentChannelId);
      if (currentChannelId === message.channelId) {
        console.log('Message for current channel');
      } else {
        console.log('Message for different channel');
      }
      dispatch(addMessage(message));
    });

    socket.on('newChannel', (channel) => {
      dispatch(addChannel(channel));
    });

    socket.on('removeChannel', (channel) => {
      dispatch(removeChannelAction(channel.id));
    });

    socket.on('renameChannel', (channel) => {
      dispatch(renameChannelAction(channel));
    });

    return () => {
      socketManager.disconnect();
    };
  }, [token, dispatch, navigate, currentChannelId]); // добавили currentChannelId для логирования

  // Загрузка начальных данных
  useEffect(() => {
    if (!token) return;
    if (channels.length === 0) {
      dispatch(fetchInitialData());
    }
  }, [dispatch, token, channels.length]);

  // Обработка ошибок (например, 401)
  useEffect(() => {
    if (error && error.status === 401) {
      dispatch(logout());
      navigate('/login');
    } else if (error) {
      toast.error(t('toast.loadingError'));
    }
  }, [error, dispatch, navigate, t]);

  const handleChannelSelect = (channelId) => {
    dispatch(setCurrentChannel(channelId));
  };

  const filteredMessages = messages.filter(
    (msg) => msg.channelId === currentChannelId
  );

  // Логирование количества сообщений при рендере
  useEffect(() => {
    console.log('Rendering messages for channel', currentChannelId, 'count:', filteredMessages.length);
  }, [filteredMessages, currentChannelId]);

  const handleSubmitMessage = async (values, { resetForm }) => {
    if (!currentChannelId) {
      console.error('No channel selected');
      return;
    }
    try {
      await dispatch(
        sendMessage({ text: values.message, channelId: currentChannelId })
      ).unwrap();
      resetForm();
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error(t('toast.messageError'));
    }
  };

  const openAddChannel = () => setShowAddChannel(true);
  const closeAddChannel = () => setShowAddChannel(false);

  const openRenameChannel = (channel) => {
    console.log('openRenameChannel called for channel:', channel);
    setSelectedChannel(channel);
    setShowRenameChannel(true);
  };
  const closeRenameChannel = () => {
    setSelectedChannel(null);
    setShowRenameChannel(false);
  };

  const openRemoveChannel = (channel) => {
    setSelectedChannel(channel);
    setShowRemoveChannel(true);
  };
  const closeRemoveChannel = () => {
    setSelectedChannel(null);
    setShowRemoveChannel(false);
  };

  const validateChannelName = (name, currentId = null) => {
    const existing = channels.find(
      (c) => c.name === name && (currentId === null || c.id !== currentId)
    );
    return !existing;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{t('loading')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column h-100">
      <Header />
      <div className="container-fluid h-100 overflow-hidden">
        <div className="row h-100">
          {/* Список каналов */}
          <div className="col-3 border-end p-0 h-100 d-flex flex-column">
            <div className="p-3 d-flex justify-content-between align-items-center">
              <h5>{t('chat.channels')}</h5>
              <button onClick={openAddChannel} className="btn btn-primary btn-sm">
                +
              </button>
            </div>
            <ul className="list-group flex-grow-1 overflow-auto">
              {channels.map((channel) => (
                <li
                  key={channel.id}
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                    currentChannelId === channel.id ? 'active' : ''
                  }`}
                  onClick={() => handleChannelSelect(channel.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleChannelSelect(channel.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="channel-name">{channel.name}</span>
                  {channel.id !== 1 && (
                    <div className="dropdown">
                      <button
                        className="btn btn-sm dropdown-toggle"
                        type="button"
                        id={`channel-menu-${channel.id}`}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="visually-hidden">{t('channel.actions')}</span>
                        ⋮
                      </button>
                      <ul className="dropdown-menu" aria-labelledby={`channel-menu-${channel.id}`}>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Rename menu item clicked for channel:', channel);
                              openRenameChannel(channel);
                            }}
                          >
                            {t('channel.rename')}
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              openRemoveChannel(channel);
                            }}
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

          {/* Сообщения и форма отправки */}
          <div className="col-9 p-0 h-100 d-flex flex-column">
            <div className="flex-grow-1 overflow-auto p-3">
              {filteredMessages.map((msg) => (
                <div key={msg.id} className="mb-2">
                  <b>{msg.username}</b>: {msg.text}
                </div>
              ))}
            </div>
            <div className="p-3 border-top">
              <Formik
                initialValues={{ message: '' }}
                validationSchema={Yup.object({
                  message: Yup.string().required(t('validation.required')),
                })}
                onSubmit={handleSubmitMessage}
              >
                {({ isSubmitting }) => (
                  <Form className="d-flex">
                    <Field
                      name="message"
                      className="form-control me-2"
                      placeholder={t('chat.typeMessage')}
                      disabled={sending}
                      aria-label="Новое сообщение"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting || sending}
                      className="btn btn-primary"
                    >
                      {t('send')}
                    </button>
                  </Form>
                )}
              </Formik>
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
              .test('unique', t('validation.channelNameUnique'), (value) =>
                validateChannelName(value)
              ),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await dispatch(createChannel(values.name)).unwrap();
              toast.success(t('toast.channelCreated'));
              closeAddChannel();
            } catch (err) {
              toast.error(t('toast.error'));
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ handleSubmit, handleChange, values, errors, touched, isSubmitting }) => (
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
                  <label htmlFor="channel-name-input">{t('channel.name')}</label>
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
                .test('unique', t('validation.channelNameUnique'), (value) =>
                  validateChannelName(value, selectedChannel.id)
                ),
            })}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await dispatch(renameChannel({ id: selectedChannel.id, name: values.name })).unwrap();
                toast.success(t('toast.channelRenamed'));
                closeRenameChannel();
              } catch (err) {
                toast.error(t('toast.error'));
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ handleSubmit, handleChange, values, errors, touched, isSubmitting }) => (
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
                    <label htmlFor="rename-channel-input">{t('channel.name')}</label>
                    {touched.name && errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={closeRenameChannel}>
                    {t('cancel')}
                  </Button>
                  <Button type="submit" variant="primary" disabled={isSubmitting}>
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
                await dispatch(removeChannel(selectedChannel.id)).unwrap();
                toast.success(t('toast.channelRemoved'));
                closeRemoveChannel();
              } catch (err) {
                toast.error(t('toast.error'));
              }
            }}
          >
            {t('delete')}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ChatPage;
