import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { setCurrentChannel } from '../slices/chatSlice'
import { show } from '../slices/modalSlice'

const ChannelList = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { channels, currentChannelId } = useSelector((state) => state.chat)

  const handleSelect = (id) => dispatch(setCurrentChannel(id))
  const handleAdd = () => dispatch(show({ type: 'add' }))
  const handleRename = (channel) => dispatch(show({ type: 'rename', extra: channel }))
  const handleRemove = (channel) => dispatch(show({ type: 'remove', extra: channel }))

  return (
    <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>{t('chat.channels')}</b>
        <button
          type="button"
          onClick={handleAdd}
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
        {channels.map((channel) => (
          <li key={channel.id} className="nav-item w-100">
            {channel.removable === false ? (
              <button
                type="button"
                className={`w-100 rounded-1 text-start btn ${
                  currentChannelId === channel.id ? 'btn-secondary' : 'btn-light'
                }`}
                onClick={() => handleSelect(channel.id)}
              >
                <span className="me-1">#</span>
                {channel.name}
              </button>
            ) : (
              <div className="d-flex dropdown btn-group">
                <button
                  type="button"
                  className={`w-100 rounded-1 text-start text-truncate btn ${
                    currentChannelId === channel.id ? 'btn-secondary' : 'btn-light'
                  }`}
                  onClick={() => handleSelect(channel.id)}
                >
                  <span className="me-1">#</span>
                  {channel.name}
                </button>
                <button
                  type="button"
                  className={`flex-grow-0 dropdown-toggle dropdown-toggle-split btn ${
                    currentChannelId === channel.id ? 'btn-secondary' : 'btn-light'
                  }`}
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span className="visually-hidden">{t('channel.actions')}</span>
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={() => handleRename(channel)}
                    >
                      {t('channel.rename')}
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="dropdown-item text-danger"
                      onClick={() => handleRemove(channel)}
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
  )
}

export default ChannelList
