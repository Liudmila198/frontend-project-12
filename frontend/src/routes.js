const apiUrl = import.meta.env.VITE_API_URL || ''

export default {
  // Все каналы
  channelsPath: () => [apiUrl, 'api', 'channels'].join('/'),

  // Конкретный канал
  channelPath: (id) => [apiUrl, 'api', 'channels', id].join('/'),

  // Сообщения конкретного канала
  channelMessagesPath: (channelId) =>
    [apiUrl, 'api', 'channels', channelId, 'messages'].join('/'),

  // Все сообщения (если нужно)
  messagesPath: () => [apiUrl, 'api', 'messages'].join('/'),

  // Аутентификация
  loginPath: () => [apiUrl, 'api', 'login'].join('/'),
  signupPath: () => [apiUrl, 'api', 'signup'].join('/'),
}
