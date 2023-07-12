import React, { useMemo } from 'react';
import {
  Building,
  Floor,
  Room,
} from '@/types';
import styles from '@/styles/SearchResults.module.css';
import simplify from '@/util/simplify';
import BuildingSearchResults from './BuildingSearchResults';

export interface SearchResultsProps {
  query: string;
  buildings: Building[];
  onSelectBuilding: (selectedBuilding: Building) => void;
  onSelectRoom: (selectedRoom: Room, building: Building, floor: Floor) => void;
}

/**
 * Displays the search results.
 */
export default function SearchResults({
  query,
  buildings,
  onSelectBuilding,
  onSelectRoom,
}: SearchResultsProps) {
  const simplifiedQuery = useMemo(() => simplify(query), [query]);

  return (
    <div className={styles['search-results']}>
      {buildings.map((building: Building) => (
        <BuildingSearchResults
          simplifiedQuery={simplifiedQuery}
          building={building}
          onSelectBuilding={onSelectBuilding}
          onSelectRoom={onSelectRoom}
          key={building.code}
        />
      ))}
    </div>
  );
}
