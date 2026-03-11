import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { sendMessage } from '../slices/chatSlice'

const MessageArea = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const { channels, messages, currentChannelId, sending } = useSelector(
    (state) => state.chat,
  )
  const username = useSelector((state) => state.auth.username)

  const currentChannel = channels.find((c) => c.id === currentChannelId)
  const filteredMessages = messages.filter((msg) => msg.channelId === currentChannelId)

  const handleSubmit = async (values, { resetForm }) => {
    if (!currentChannelId) return
    try {
      await dispatch(
        sendMessage({ text: values.message, channelId: currentChannelId, username }),
      ).unwrap()
      resetForm()
    } catch {
      toast.error(t('toast.messageError'))
    }
  }

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        {/* Header */}
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b># {currentChannel?.name}</b>
          </p>
          <span className="text-muted">
            {t('chat.messagesCount', { count: filteredMessages.length })}
          </span>
        </div>

        {/* Messages */}
        <div id="messages-box" className="chat-messages overflow-auto px-5">
          {filteredMessages.map((msg) => (
            <div key={msg.id} className="text-break mb-2">
              <b>{msg.username}</b>
              {': '}
              {msg.text}
            </div>
          ))}
        </div>

        {/* Send form */}
        <div className="mt-auto px-5 py-3">
          <Formik
            initialValues={{ message: '' }}
            validationSchema={Yup.object({
              message: Yup.string().required(t('validation.required')),
            })}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="py-1 border rounded-2">
                <div className="input-group has-validation">
                  <Field
                    name="message"
                    className="border-0 p-0 ps-2 form-control"
                    placeholder={t('chat.typeMessage')}
                    disabled={isSubmitting || sending}
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
  )
}

export default MessageArea