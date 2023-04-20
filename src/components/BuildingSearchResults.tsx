import React, { useMemo } from 'react';
import {
  Building,
  Floor,
  FloorMap,
  Room,
} from '@/types';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import styles from '@/styles/BuildingSearchResults.module.css';
import clsx from 'clsx';
import RoomPin from './RoomPin';

function titleCase(str: string) {
  return str.split(' ')
    .map((word: string) => word.substring(0, 1).toUpperCase() + word.substring(1))
    .join(' ');
}

function roomType(room: Room): string {
  switch (room.type) {
    case 'study':
      return 'Study Room';
    default:
      return room.type;
  }
}

export interface BuildingSearchResultsProps {
  simplifiedQuery: string;
  building: Building;
  floorMap: FloorMap;
  onSelectBuilding: (selectedBuilding: Building) => void;
}

export default function BuildingSearchResults({
  simplifiedQuery,
  building,
  floorMap,
  onSelectBuilding,
}: BuildingSearchResultsProps) {
  const filteredRooms: Room[] = useMemo(() => {
    if (simplifiedQuery === '' || !simplifiedQuery.startsWith(building.code.toLowerCase())) {
      return [];
    }

    const queryRoom = simplifiedQuery.substring(building.code.length);

    return building.floors.flatMap((floor: Floor) => (
      floorMap[`${building.code}-${floor.name}`]
        ?.rooms
        .filter((room: Room) => (
          room.name.toLowerCase().startsWith(queryRoom)
          || (room.name.substring(floor.name.length).toLowerCase()).startsWith(queryRoom)
        ))
      ?? []
    ));
  }, [building, simplifiedQuery, floorMap]);

  return (
    <div>
      <button
        type="button"
        className={clsx(
          styles['search-list-element'],
          styles['search-list-element-building'],
          filteredRooms.length > 0 && styles['search-list-element-sticky'],
        )}
        onClick={() => onSelectBuilding(building)}
      >
        <span className="floor-roundel">
          {building.code}
        </span>
        <span
          className={styles['search-list-element-title']}
        >
          {building.name}
        </span>
        <ChevronRightIcon className={styles['search-list-arrow']} />
      </button>

      {filteredRooms.map((room: Room) => (
        <button
          type="button"
          className={styles['search-list-element']}
          key={room.id}
          // onClick={() => onSelectBuilding(building)}
          // @todo
        >
          <div className={styles['search-list-element-pin']}>
            <RoomPin room={room} />
          </div>
          <div
            className={clsx(
              styles['search-list-element-title'],
              styles['search-list-element-room'],
            )}
          >
            <div>
              <span className={styles['search-room-code']}>
                {building.code}
                {' '}
                {room.name}
              </span>
              {room.type !== 'default' && (
                <span>{` • ${titleCase(roomType(room))}`}</span>
              )}
            </div>
            {room.alias && <div>{room.alias}</div>}
          </div>
          <ChevronRightIcon className={styles['search-list-arrow']} />
        </button>
      ))}
    </div>
  );
}
