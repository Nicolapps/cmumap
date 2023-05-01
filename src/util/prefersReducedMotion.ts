export default function prefersReducedMotion() {
  return window?.matchMedia('(prefers-reduced-motion: reduce)')?.matches;
}
