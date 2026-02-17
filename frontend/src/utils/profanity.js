import Filter from 'leo-profanity'

Filter.loadDictionary('ru')

export const filterProfanity = (text) => {
  return Filter.clean(text)
}

export const hasProfanity = (text) => {
  return Filter.check(text)
}
