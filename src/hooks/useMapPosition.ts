'use client';

import { MutableRefObject, useEffect, useRef } from 'react';
import { CoordinateRegion } from 'mapkit-react';

export interface UseMapPositionHandlers {
  onRegionChangeStart: () => void;
  onRegionChangeEnd: () => void;
}

const UPDATE_PERIOD_MS = 200;
const MAX_UPDATE_TIME_MS = 3000;

export default function useMapPosition(
  callback: (region: CoordinateRegion, density: number) => void,
  mapRef: MutableRefObject<mapkit.Map | null>,
): UseMapPositionHandlers {
  const timeout = useRef<number | null>(null);
  const iterations = useRef(0);

  // @TODO Max counter
  const update = () => {
    console.log('Update! ', iterations.current);

    const map = mapRef.current;
    if (!map) return;

    const width = window.innerWidth ?? 0;
    if (!width) return;

    const { region } = map;
    const dist = region.span.longitudeDelta;
    const density = width / dist;

    callback({
      centerLatitude: region.center.latitude,
      centerLongitude: region.center.longitude,
      latitudeDelta: region.span.latitudeDelta,
      longitudeDelta: region.span.longitudeDelta,
    }, density);
  };

  const updateAndTimeout = () => {
    update();
    iterations.current += 1;

    const maxConsecutiveIterations = MAX_UPDATE_TIME_MS / UPDATE_PERIOD_MS;
    if (iterations.current < maxConsecutiveIterations) {
      timeout.current = window.setTimeout(updateAndTimeout, UPDATE_PERIOD_MS);
    }
  };

  const onRegionChangeStart = () => {
    if (timeout.current !== null) {
      window.clearTimeout(timeout.current);
    }

    // Start auto-update
    iterations.current = 0;
    timeout.current = window.setTimeout(updateAndTimeout, UPDATE_PERIOD_MS);
    console.log('START', timeout.current);
  };

  const onRegionChangeEnd = () => {
    console.log('End', timeout.current);
    update();

    // Stop auto-update
    if (timeout.current !== null) {
      window.clearTimeout(timeout.current);
    }
    timeout.current = null;
  };

  // Clear the timeout
  useEffect(() => () => {
    if (timeout.current !== null) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
  }, []);

  return { onRegionChangeStart, onRegionChangeEnd };
}
