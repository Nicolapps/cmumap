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
    <>
      <button
        type="button"
        className={clsx(
          styles['search-list-element'],
          styles['search-list-element-building'],
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
          // onClick={() => onSelectBuilding(building)}
          // @todo
        >
          <span
            className={styles['search-list-element-title']}
          >
            {building.code}
            -
            {room.name}
          </span>
          <ChevronRightIcon className={styles['search-list-arrow']} />
        </button>
      ))}
    </>
  );
}
