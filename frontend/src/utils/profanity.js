import Filter from 'leo-profanity'

Filter.loadDictionary('ru')
Filter.loadDictionary('en')
/**
 * Фильтрует нецензурные слова в тексте.
 * @param {string} text - Исходный текст.
 * @returns {string} - Текст с заменёнными нецензурными словами.
 */
export const filterProfanity = (text) => {
  return Filter.clean(text)
}
/**
 * Проверяет наличие нецензурных слов в тексте.
 * @param {string} text - Проверяемый текст.
 * @returns {boolean} - true, если найдены нецензурные слова.
 */
