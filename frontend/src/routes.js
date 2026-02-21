// frontend/src/routes.js

// Базовый URL вашего API. Если бэкенд запущен на том же хосте и порту, что и фронтенд,
// можно оставить пустую строку. Если бэкенд отдельно (например, на порту 5001), укажите:
// const apiUrl = 'http://localhost:5001';
const apiUrl = process.env.REACT_APP_API_URL || '' // для гибкости через переменные окружения

export default {
  // Путь для получения всех каналов (если нужно)
  channelsPath: () => [apiUrl, 'api', 'channels'].join('/'),

  // Путь для получения сообщений конкретного канала
  channelMessagesPath: (channelId) =>
    [apiUrl, 'api', 'channels', channelId, 'messages'].join('/'),

  // Путь для отправки нового сообщения (обычно совпадает с channelMessagesPath)
  messagesPath: (channelId) =>
    [apiUrl, 'api', 'channels', channelId, 'messages'].join('/'),

  // Путь для авторизации
  loginPath: () => [apiUrl, 'api', 'login'].join('/'),

  // Путь для регистрации
  signupPath: () => [apiUrl, 'api', 'signup'].join('/'),

  // Если есть другие эндпоинты — добавляйте аналогично
}
