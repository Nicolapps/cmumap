import { latitudeRatio, longitudeRatio, rotate } from '@/geometry';
import {
  AbsoluteCoordinate, getRoomTypeDetails, Placement, Room, RoomType,
} from '@/types';
import {
  Annotation, Coordinate, Polygon,
} from 'mapkit-react';
import React, { useMemo } from 'react';
import styles from '../styles/FloorPlan.module.css';

interface FloorPlanProps {
  rooms: Room[];
  placement: Placement;
  showRoomNames: boolean;
  isBackground: boolean;
}

const icons: { [type: string]: string } = {
  elevator: 'M11,1H4A1,1,0,0,0,3,2V13a1,1,0,0,0,1,1h7a1,1,0,0,0,1-1V2A1,1,0,0,0,11,1ZM7.5,12.5l-2-4h4Zm-2-6,2-4,2,4Z',
  restroom: 'M3 1.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0ZM11.5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM3.29 4a1 1 0 0 0-.868.504L.566 7.752a.5.5 0 1 0 .868.496l1.412-2.472A345.048 345.048 0 0 0 1 11h2v2.5a.5.5 0 0 0 1 0V11h1v2.5a.5.5 0 0 0 1 0V11h2L6.103 5.687l1.463 2.561a.5.5 0 1 0 .868-.496L6.578 4.504A1 1 0 0 0 5.71 4H3.29ZM9 4.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v4a.5.5 0 0 1-1 0v-4h-1v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 1-1 0v-5Z',
  stairs: 'M15 1V2H12V4V5H11H9V7V8H8H6V10V11H5H3V13V14H2H0V13H2V11C2 10.4477 2.44772 10 3 10H5V8C5 7.44772 5.44772 7 6 7H8V5C8 4.44772 8.44771 4 9 4H11V2C11 1.44772 11.4477 1 12 1L15 1Z',
};

export default function FloorPlan({
  rooms,
  placement,
  showRoomNames,
  isBackground,
}: FloorPlanProps) {
  // Compute the center position of the bounding box of the current floor
  // (Will be used as the rotation center)
  const center: (AbsoluteCoordinate | undefined) = useMemo(() => {
    if (!rooms) return undefined;

    const points: AbsoluteCoordinate[] = rooms.flatMap((room: Room) => room.shapes.flat());
    const allX = points.map((p) => p.x);
    const allY = points.map((p) => p.y);

    const minX = Math.min(...allX);
    const maxX = Math.max(...allX);
    const minY = Math.min(...allY);
    const maxY = Math.max(...allY);

    return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
  }, [rooms]);

  const convertToMap = (absolute: AbsoluteCoordinate): Coordinate => {
    if (placement === null) throw new Error('No active placement');
    if (!center) throw new Error('No center');

    const [absoluteY, absoluteX] = rotate(
      absolute.x - center.x,
      absolute.y - center.y,
      placement.angle,
    );

    return {
      latitude: (absoluteY / latitudeRatio) / placement.scale + placement.center.latitude,
      longitude: (absoluteX / longitudeRatio) / placement.scale + placement.center.longitude,
    };
  };

  return (
    <>
      {rooms.map((room: Room) => {
        if (room.shapes.length !== 1) {
          throw new Error('Multi-shape rooms are not supported.');
        }
        const pointsSrc = room.shapes[0].map(convertToMap);

        const roomColors = getRoomTypeDetails(room.type);

        const labelPos = convertToMap(room.labelPosition!);

        const icon = icons[room.type] ?? null;

        const opacity = isBackground ? 0.7 : 1;

        return (
          <React.Fragment key={room.id}>
            <Polygon
              points={[
                ...pointsSrc,
                pointsSrc[0],
              ]}
              selected={false}
              enabled={false}
              fillColor={roomColors.background}
              fillOpacity={opacity}
              strokeColor={roomColors.border}
              strokeOpacity={opacity}
              lineWidth={1}
            />
            {!isBackground && (
              <Annotation
                latitude={labelPos.latitude}
                longitude={labelPos.longitude}
              >
                <div className={`${styles.marker} ${icon ? styles['marker-with-icon'] : ''}`}>
                  <div
                    className={`${styles.pin} ${icon ? styles['pin-with-icon'] : ''}`}
                    style={{ background: roomColors.primary }}
                  >
                    {icon && (
                      <svg xmlns="http://www.w3.org/2000/svg" id="elevator" width="15" height="15" viewBox="0 0 15 15">
                        <path d={icon} />
                      </svg>
                    )}
                  </div>
                  {showRoomNames && (
                    <span className={styles.label}>{room.name}</span>
                  )}
                </div>
              </Annotation>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
}
