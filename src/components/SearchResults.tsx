import React, { useMemo } from 'react';
import { Building, FloorMap } from '@/types';
import styles from '@/styles/SearchResults.module.css';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
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
  const simplifiedQuery = useMemo(() => query.trim().toLowerCase(), [query]);

  const filteredBuildings = useMemo(() => {
    if (simplifiedQuery === '') {
      return buildings;
    }

    return buildings.filter((b: Building) => (
      simplifiedQuery.startsWith(b.code.toLowerCase())
      || b.name.toLowerCase().includes(simplifiedQuery)
    ));
  }, [buildings, simplifiedQuery]);

  return (
    <>
      {filteredBuildings.map((building: Building) => (
        <BuildingSearchResults
          query={simplifiedQuery}
          building={building}
          floorMap={floorMap}
          onSelectBuilding={onSelectBuilding}
          key={building.code}
        />
      ))}

      {filteredBuildings.length === 0 && (
        <div className={styles['search-not-found']}>
          <ExclamationCircleIcon className={styles['search-not-found-icon']} />
          No results found.
        </div>
      )}
    </>
  );
}
