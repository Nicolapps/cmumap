/**
 * Converts a string to title case.
 * For instance, titleCase('hello world') === 'Hello World'
 * @param str The string
 * @returns The string with title case
 */
export default function titleCase(str: string) {
  return str.split(' ')
    .map((word: string) => word.substring(0, 1).toUpperCase() + word.substring(1))
    .join(' ');
}
