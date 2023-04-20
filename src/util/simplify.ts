export default function simplify(str: string) {
  return str.trim().toLowerCase().replaceAll(/[-—.é ]/g, '');
}
