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
            onClick={(e) => e.stopPropagation()} // предотвращаем выбор канала при клике на меню
          >
            ⋮
          </button>
          <ul className="dropdown-menu" aria-labelledby={`channel-menu-${channel.id}`}>
            <li>
              <button
                className="dropdown-item"
                onClick={(e) => {
                  e.stopPropagation();
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
