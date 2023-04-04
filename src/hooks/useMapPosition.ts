import { CoordinateRegion } from 'mapkit-react';

export default function useMapPosition(
  callback: (region: CoordinateRegion, density: number) => void,
): ((newValue: CoordinateRegion) => void) {
  // @TODO Invoke callback when we want to.

  return (region) => {
    const width = window.innerWidth ?? 0;
    const dist = region.longitudeDelta;
    const density = width / dist;

    callback(region, density);
  };
}
