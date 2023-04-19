import React from 'react';
import { Building, FloorMap } from '@/types';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import styles from '@/styles/SearchResults.module.css';

export interface SearchResultsProps {
  query: string;
  buildings: Building[];
  floorMap: FloorMap;
  onSelectBuilding: (selectedBuilding: Building) => void;
}

export default function SearchResults({
  query,
  buildings,
  floorMap,
  onSelectBuilding,
}: SearchResultsProps) {
  return (
    <>
      {buildings.map((building: Building) => building.code !== 'BH-PH' && (
        <button
          type="button"
          className={styles['search-list-element']}
          key={building.code}
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
      ))}
    </>
  );
}
