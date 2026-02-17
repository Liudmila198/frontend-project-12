import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  ru: {
    translation: {
      'header.brand': 'Hexlet Chat',
      'header.logout': 'Выйти',
      loading: 'Загрузка...',
      send: 'Отправить',
      cancel: 'Отмена',
      delete: 'Удалить',
      rename: 'Переименовать',
      add: 'Добавить',
      close: 'Закрыть',
      confirm: 'Подтвердить',

      'login.title': 'Войти',
      'login.username': 'Ваш ник',
      'login.password': 'Пароль',
      'login.submit': 'Войти',
      'login.noAccount': 'Нет аккаунта?',
      'login.signupLink': 'Регистрация',
      'login.error': 'Неверные имя пользователя или пароль',

      'signup.title': 'Регистрация',
      'signup.username': 'Имя пользователя',
      'signup.password': 'Пароль',
      'signup.confirmPassword': 'Подтвердите пароль',
      'signup.submit': 'Зарегистрироваться',
      'signup.alreadyHaveAccount': 'Уже есть аккаунт?',
      'signup.loginLink': 'Войти',
      'signup.errorExists': 'Пользователь с таким именем уже существует',

      'validation.required': 'Обязательное поле',
      'validation.usernameLength': 'От 3 до 20 символов',
      'validation.passwordMin': 'Не менее 6 символов',
      'validation.passwordsMustMatch': 'Пароли должны совпадать',
      'validation.channelNameLength': 'От 3 до 20 символов',
      'validation.channelNameUnique': 'Должно быть уникальным',

      'chat.channels': 'Каналы',
      'chat.messages': 'Сообщения',
      'chat.typeMessage': 'Введите сообщение...',
      'chat.addChannel': 'Добавить канал',
      'channel.actions': 'Управление каналом',
      'channel.rename': 'Переименовать',
      'channel.remove': 'Удалить',
      'channel.removeConfirm': 'Уверены?',
      'channel.removeConfirmText':
        'Вы действительно хотите удалить канал? Все сообщения будут потеряны.',
      'channel.name': 'Имя канала',

      'modal.addChannel': 'Добавить канал',
      'modal.renameChannel': 'Переименовать канал',
      'modal.removeChannel': 'Удалить канал',
      'modal.submit': 'Отправить',
      'modal.cancel': 'Отмена',

      'toast.channelCreated': 'Канал создан',
      'toast.channelRenamed': 'Канал переименован',
      'toast.channelRemoved': 'Канал удалён',
      'toast.error': 'Ошибка',
      'toast.networkError': 'Ошибка соединения',
      'toast.loadingError': 'Ошибка загрузки данных',
      'toast.messageError': 'Ошибка отправки сообщения',
      'toast.unknownError': 'Неизвестная ошибка',
    },
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'ru',
  fallbackLng: 'ru',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
