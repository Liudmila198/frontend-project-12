import { useDispatch, useSelector } from 'react-redux'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Modal, Button } from 'react-bootstrap'

import { hide } from '../slices/modalSlice'
import {
  createChannel,
  renameChannel,
  removeChannel,
} from '../slices/chatSlice'

// ─── Sub-forms ────────────────────────────────────────────────────────────────

const AddChannelForm = ({ onClose, validateChannelName }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  return (
    <Formik
      initialValues={{ name: '' }}
      validationSchema={Yup.object({
        name: Yup.string()
          .min(3, t('validation.channelNameLength'))
          .max(20, t('validation.channelNameLength'))
          .required(t('validation.required'))
          .test('unique', t('validation.channelNameUnique'), validateChannelName),
      })}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await dispatch(createChannel(values.name)).unwrap()
          toast.success(t('toast.channelCreated'))
          onClose()
        } catch {
          toast.error(t('toast.error'))
        } finally {
          setSubmitting(false)
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
            <Button variant="secondary" onClick={onClose}>{t('cancel')}</Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? t('loading') : t('add')}
            </Button>
          </Modal.Footer>
        </form>
      )}
    </Formik>
  )
}

const RenameChannelForm = ({ channel, onClose, validateChannelName }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  return (
    <Formik
      initialValues={{ name: channel.name }}
      validationSchema={Yup.object({
        name: Yup.string()
          .min(3, t('validation.channelNameLength'))
          .max(20, t('validation.channelNameLength'))
          .required(t('validation.required'))
          .test('unique', t('validation.channelNameUnique'), (value) =>
            validateChannelName(value, channel.id),
          ),
      })}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await dispatch(renameChannel({ id: channel.id, name: values.name })).unwrap()
          toast.success(t('toast.channelRenamed'))
          onClose()
        } catch {
          toast.error(t('toast.error'))
        } finally {
          setSubmitting(false)
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
            <Button variant="secondary" onClick={onClose}>{t('cancel')}</Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? t('loading') : t('rename')}
            </Button>
          </Modal.Footer>
        </form>
      )}
    </Formik>
  )
}

const RemoveChannelForm = ({ channel, onClose }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const handleRemove = async () => {
    try {
      await dispatch(removeChannel(channel.id)).unwrap()
      toast.success(t('toast.channelRemoved'))
      onClose()
    } catch {
      toast.error(t('toast.error'))
    }
  }

  return (
    <>
      <Modal.Body>
        <p>{t('channel.removeConfirmText')}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>{t('cancel')}</Button>
        <Button variant="danger" onClick={handleRemove}>{t('delete')}</Button>
      </Modal.Footer>
    </>
  )
}

// ─── Title map ────────────────────────────────────────────────────────────────

const TITLE_KEY = {
  add: 'modal.addChannel',
  rename: 'modal.renameChannel',
  remove: 'modal.removeChannel',
}

// ─── Root modal ───────────────────────────────────────────────────────────────

const ChannelModal = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { isOpened, type, extra } = useSelector((state) => state.modal)
  const channels = useSelector((state) => state.chat.channels)

  const onClose = () => dispatch(hide())

  const validateChannelName = (name, currentId = null) =>
    !channels.find(
      (c) => c.name === name && (currentId === null || c.id !== currentId),
    )

  const bodyMap = {
    add: <AddChannelForm onClose={onClose} validateChannelName={validateChannelName} />,
    rename: extra && (
      <RenameChannelForm
        channel={extra}
        onClose={onClose}
        validateChannelName={validateChannelName}
      />
    ),
    remove: extra && <RemoveChannelForm channel={extra} onClose={onClose} />,
  }

  return (
    <Modal show={isOpened} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{type ? t(TITLE_KEY[type]) : ''}</Modal.Title>
      </Modal.Header>
      {type && bodyMap[type]}
    </Modal>
  )
}

export default ChannelModal
