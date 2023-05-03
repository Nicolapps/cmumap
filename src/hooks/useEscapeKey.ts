import { useEffect } from 'react';

/**
 * Hook that detects when the escape key is pressed.
 * @param onEscape The callback function called when the escape key is pressed
 */
export default function useEscapeKey(onEscape: () => void) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscape();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onEscape]);
}
