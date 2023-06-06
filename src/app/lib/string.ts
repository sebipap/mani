/**
 * Given a string value, return a normalized version of it, which implies
 * using a standard version for any accents such as 'ó', using lowerCase,
 * and removing all diacritics/special characters
 *
 * @param value - the string to normalize
 */
export function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}
