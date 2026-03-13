import Filter from 'leo-profanity'

// Загружаем необходимые словари
Filter.loadDictionary('ru')
Filter.loadDictionary('en')

// При необходимости можно добавить только уникальные слова, отсутствующие в словарях
// Filter.add(['какое-то', 'специфичное', 'слово']);

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
