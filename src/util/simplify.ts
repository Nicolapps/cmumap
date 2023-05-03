/**
 * Converts a given string to a canonical form that can be used when comparing
 * a search query to potential results.
 * For instance, simplify(' La Prima ') === 'laprima'.
 * @param str The string
 * @returns The simplified string
 */
export default function simplify(str: string) {
  return str.trim().toLowerCase().replaceAll(/[-—.é ]/g, '');
}
