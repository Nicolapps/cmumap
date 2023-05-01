export default function titleCase(str: string) {
  return str.split(' ')
    .map((word: string) => word.substring(0, 1).toUpperCase() + word.substring(1))
    .join(' ');
}
