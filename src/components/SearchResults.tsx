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

function simplify(str: string) {
  return str.trim().toLowerCase().replaceAll(/[-. ]/g, '');
}

export default function SearchResults({
  query,
  buildings,
  floorMap,
  onSelectBuilding,
}: SearchResultsProps) {
  const simplifiedQuery = useMemo(() => simplify(query), [query]);

  const filteredBuildings = useMemo(() => {
    if (simplifiedQuery === '') {
      return buildings;
    }

    return buildings.filter((b: Building) => (
      simplifiedQuery.startsWith(b.code.toLowerCase())
      || simplify(b.name).includes(simplifiedQuery)
      || simplify(b.code).includes(simplifiedQuery)
    ));
  }, [buildings, simplifiedQuery]);

  return (
    <>
      {filteredBuildings.map((building: Building) => (
        <BuildingSearchResults
          simplifiedQuery={simplifiedQuery}
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
