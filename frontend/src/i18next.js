import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ru from './locales/ru.js'

i18n
  .use(initReactI18next)
  .init({
    // debug: true,
    resources: {
      ru: { translation: ru },
    },
    lng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
