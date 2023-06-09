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
import simplify from '@/util/simplify';
import titleCase from '@/util/titleCase';
import Roundel from './Roundel';
import RoomPin from './RoomPin';

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
  onSelectRoom: (selectedRoom: Room, building: Building, floor: Floor) => void;
}

type RoomWithOrdinal = Room & { floor: Floor };

/**
 * Displays the search results for a specific building.
 */
export default function BuildingSearchResults({
  simplifiedQuery,
  building,
  floorMap,
  onSelectBuilding,
  onSelectRoom,
}: BuildingSearchResultsProps) {
  const roomNames: string[] = useMemo(() => (
    building.floors.flatMap((floor: Floor) => (
      floorMap[`${building.code}-${floor.name}`]
        ?.rooms
        .filter((room: Room) => room.alias)
        .map((room: Room) => simplify(room.alias!))
      ?? []
    ))), [building, floorMap]);

  const filteredRooms: RoomWithOrdinal[] = useMemo(() => {
    // No query: only show building names
    if (simplifiedQuery === '') {
      return [];
    }

    // Query for another building
    const searchForThisBuilding = simplifiedQuery.startsWith(building.code.toLowerCase());
    const queryRoom = simplifiedQuery.substring(building.code.length);

    return building.floors.flatMap((floor: Floor) => (
      floorMap[`${building.code}-${floor.name}`]
        ?.rooms
        .filter((room: Room) => (
          (searchForThisBuilding && (
            room.name.toLowerCase().startsWith(queryRoom)
            || (room.name.substring(floor.name.length).toLowerCase()).startsWith(queryRoom)
          ))
          || (room.alias && simplify(room.alias).includes(simplifiedQuery))
        ))
        .map((room: Room) => ({
          ...room,
          floor,
        }))
      ?? []
    ));
  }, [building, simplifiedQuery, floorMap]);

  const isVisible = useMemo(() => (
    simplifiedQuery === ''
    || simplifiedQuery.startsWith(building.code.toLowerCase())
    || simplify(building.name).includes(simplifiedQuery)
    || simplify(building.code).includes(simplifiedQuery)
    || roomNames.some((roomName: string) => roomName.includes(simplifiedQuery))
  ), [building, simplifiedQuery, roomNames]);

  if (!isVisible) {
    return null;
  }

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
        <Roundel code={building.code} />
        <span className={styles['search-list-element-title']}>
          {building.name}
        </span>
        <ChevronRightIcon className={styles['search-list-arrow']} />
      </button>

      {filteredRooms.map((room: RoomWithOrdinal) => (
        <button
          type="button"
          className={styles['search-list-element']}
          key={room.id}
          onClick={() => onSelectRoom(room, building, room.floor)}
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
            {room.alias && (
              <div className={styles['search-room-name']}>{room.alias}</div>
            )}
          </div>
          <ChevronRightIcon className={styles['search-list-arrow']} />
        </button>
      ))}
    </div>
  );
}
