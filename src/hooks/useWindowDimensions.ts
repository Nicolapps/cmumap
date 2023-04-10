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

// https://stackoverflow.com/a/59185109/4652564
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
