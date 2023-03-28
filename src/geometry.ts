import { Coordinate } from 'mapkit-react';
import { AbsoluteCoordinate } from './types';

// The number of meters in a degree.
// Values computed for the Pittsburgh region using https://stackoverflow.com/a/51765950/4652564
export const latitudeRatio = 111318.8450631976;
export const longitudeRatio = 84719.3945182816;

/**
 * Returns the distance in meters between two points
 */
export function mapDistance(a: Coordinate, b: Coordinate) {
  const squareSum = ((a.latitude - b.latitude) * latitudeRatio) ** 2
    + ((a.longitude - b.longitude) * longitudeRatio) ** 2;
  return Math.sqrt(squareSum);
}

export function distance(a: AbsoluteCoordinate, b: AbsoluteCoordinate) {
  const squareSum = (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
  return Math.sqrt(squareSum);
}

export function hasOverlap(
  aTopLeft: AbsoluteCoordinate,
  aBottomRight: AbsoluteCoordinate,
  bTopLeft: AbsoluteCoordinate,
  bBottomRight: AbsoluteCoordinate,
) {
  // One rectangle is left of the other
  if (aBottomRight.x < bTopLeft.x || bBottomRight.x < aTopLeft.x) {
    return false;
  }

  // One rectangle is above the other
  if (aBottomRight.y < bTopLeft.y || bBottomRight.y < aTopLeft.y) {
    return false;
  }

  return true;
}

export function rangeOverlap(aMin: number, aMax: number, bMin: number, bMax: number) {
  return bMin < aMin ? bMax > aMin : bMin < aMax;
}

// Based on https://stackoverflow.com/a/29915728/4652564
export function isInPolygon(vertices: AbsoluteCoordinate[], point: AbsoluteCoordinate) {
  const { x, y } = point;

  let inside = false;
  // eslint-disable-next-line no-plusplus
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const xi = vertices[i].x;
    const yi = vertices[i].y;
    const xj = vertices[j].x;
    const yj = vertices[j].y;

    const intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
}

/**
 * Returns the angle in degrees between the center an da point
 */
export function angleBetween(center: Coordinate, point: Coordinate) {
  const latitudeDiff = (point.latitude - center.latitude) * latitudeRatio;
  const longitudeDiff = (point.longitude - center.longitude) * longitudeRatio;
  return (Math.atan2(latitudeDiff, longitudeDiff) * 180) / Math.PI;
}

// Based on https://stackoverflow.com/a/17411276/4652564
export function rotate(x: number, y: number, angle: number): number[] {
  const radians = (Math.PI / 180) * angle;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const nx = (cos * x) + (sin * y);
  const ny = (cos * y) - (sin * x);
  return [nx, ny];
}
