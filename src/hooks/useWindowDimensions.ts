import { useState, useEffect } from 'react';

function getWindowDimensions() {
  const hasWindow = typeof window !== 'undefined';

  const width = hasWindow ? window.innerWidth : null;
  const height = hasWindow ? window.innerHeight : null;
  return {
    width,
    height,
  };
}

/**
 * Hook to determine the dimensions of the room
 * Based on https://stackoverflow.com/a/59185109/4652564
 */
export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    const hasWindow = typeof window !== 'undefined';
    if (!hasWindow) return undefined;

    const handleResize = () => {
      setWindowDimensions(getWindowDimensions());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

/**
 * Hook to determine whether the desktop layout is active.
 * @returns true if the desktop layout is active; false otherwise
 */
export function useIsDesktop() {
  const windowDimensions = useWindowDimensions();
  return windowDimensions
    && windowDimensions.width
    && windowDimensions.width >= 768;
}
