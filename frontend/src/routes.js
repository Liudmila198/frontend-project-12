const apiUrl = process.env.REACT_APP_API_URL || ''

export default {
  channelsPath: () => [apiUrl, 'api', 'channels'].join('/'),
  channelPath: (id) => [apiUrl, 'api', 'channels', id].join('/'),
  channelMessagesPath: (channelId) =>
    [apiUrl, 'api', 'channels', channelId, 'messages'].join('/'),
  messagesPath: () => [apiUrl, 'api', 'messages'].join('/'),
  loginPath: () => [apiUrl, 'api', 'login'].join('/'),
  signupPath: () => [apiUrl, 'api', 'signup'].join('/'),
}
