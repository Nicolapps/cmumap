import React, { useMemo } from 'react';
import { Building, FloorMap } from '@/types';
import styles from '@/styles/SearchResults.module.css';
import simplify from '@/util/simplify';
import BuildingSearchResults from './BuildingSearchResults';

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
  const simplifiedQuery = useMemo(() => simplify(query), [query]);

  return (
    <div className={styles['search-results']}>
      {buildings.map((building: Building) => (
        <BuildingSearchResults
          simplifiedQuery={simplifiedQuery}
          building={building}
          floorMap={floorMap}
          onSelectBuilding={onSelectBuilding}
          key={building.code}
        />
      ))}
    </div>
  );
}
