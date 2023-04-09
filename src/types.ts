import { Coordinate } from 'mapkit-react';

export interface AbsoluteCoordinate {
  x: number;
  y: number;
}

export type RoomType =
  'default'
  | 'corridor'
  | 'auditorium'
  | 'office'
  | 'classroom'
  | 'operational' // Used for storage or maintenance, not publicly accessible
  | 'conference'
  | 'study'
  | 'laboratory'
  | 'computer lab'
  | 'studio'
  | 'workshop'
  | 'vestibule'
  | 'storage'
  | 'restroom'
  | 'stairs'
  | 'elevator'
  | 'ramp'
  | 'dining'
  | 'store'
  | 'library'
  | 'sport'
  | 'parking';

interface RoomTypeDetails {
  primary: string;
  background: string;
  border: string;
}

export function getRoomTypeDetails(type: RoomType): RoomTypeDetails {
  switch (type) {
    // @TODO Improve the background/border colors
    case 'default':
      return { primary: '#b5b3b2', background: '#eeeeee', border: '#cccccc' };
    case 'corridor':
      return { primary: '#cecece', background: '#fefefe', border: '#cccccc' };
    case 'office':
      return { primary: '#b5b3b2', background: '#eeeeee', border: '#cccccc' };
    case 'auditorium':
    case 'classroom':
    case 'conference':
      return { primary: '#7082b3', background: '#e6ecfe', border: '#9eabcd' };
    case 'operational':
    case 'storage':
      return { primary: '#808080', background: '#ece3d5', border: '#b9b9b9' };
    case 'laboratory':
    case 'computer lab':
    case 'studio':
    case 'workshop':
      return { primary: '#ff7e81', background: '#ffdbdc', border: '#ff7e81' };
    case 'vestibule':
      return { primary: '#eeeeee', background: '#f0f0f0', border: '#cccccc' };
    case 'restroom':
      return { primary: '#c39dff', background: '#e7dfed', border: '#d6d0db' };
    case 'stairs':
    case 'elevator':
    case 'ramp':
      return { primary: '#3b92f0', background: '#c4dadf', border: '#9bacb0' };
    case 'dining':
      return { primary: '#ff961c', background: '#ffdcb2', border: '#f8992a' };
    case 'store':
      return { primary: '#ffc855', background: '#fff0d0', border: '#ffc855' };
    case 'library':
    case 'study':
      return { primary: '#d18e63', background: '#f5dbc8', border: '#d18e63' };
    case 'sport':
      return { primary: '#6bc139', background: '#e1fcd1', border: '#9ac382' };
    case 'parking':
      return { primary: '#51a2f7', background: '#d4e9ff', border: '#51a2f7' };
    default:
      throw new Error(`Unknown room type ${type}`);
  }
}

export interface Room {
  /**
   * Unique ID (UUID)
   */
  id: string;

  shapes: AbsoluteCoordinate[][];

  /**
   * The short name of the room, without the building name but including the
   * floor level (e.g. '121' for CUC 121)
   */
  name: string;

  /**
   * The name extracted from the SVG file attributes, when applicable
   */
  sourceNameAttribute?: string | null;

  /**
   * The name extracted from the SVG file labels, when applicable
   */
  sourceNameLabel?: string | null;

  /**
   * Another name under which the room is known (e.g. 'McConomy Auditorium')
   */
  alias?: string;

  type: RoomType;

  labelPosition?: AbsoluteCoordinate;

  /**
   * A warning generated during automatic extraction
   */
  warning?: string;

  /**
   * A comment for internal usage
   */
  comment?: string;
}

/**
 * The placement of a SVG building in the real world.
 */
export interface Placement {
  /**
   * The coordinate of the building's bounding box center.
   */
  center: Coordinate;

  /**
   * The scale of the building (how many SVG units in a meter).
   */
  scale: number;

  /**
   * The angle, in degrees, at which the building is rotated.
   */
  angle: number;
}

export interface Floor {
  name: string;
  ordinal: number;
}

export interface FloorPlan {
  placement: Placement;
  rooms: Room[];
}

export interface Building {
  code: string;
  name: string;
  osmId: string;
  floors: Floor[];
  defaultFloor: string;
  labelPosition: Coordinate;
  shapes: Coordinate[][];
  comment?: string;
  hitbox: Coordinate[] | null;
}

export interface TextZone {
  center: AbsoluteCoordinate;
  text: string;
}

export interface SVGPathCommand {
  command: string;
  x: number;
  y: number;
  x0: number;
  y0: number;
  largeArc?: boolean;
  sweep?: boolean;
  rx?: number;
  ry?: number;
  xAxisRotation?: number;
}
