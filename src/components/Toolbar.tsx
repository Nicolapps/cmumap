import React, { useState } from 'react';
import styles from '@/styles/Toolbar.module.css';
import {
  MagnifyingGlassIcon, ArrowLeftIcon,
} from '@heroicons/react/24/solid';
import FloorSwitcher from '@/components/FloorSwitcher';
import { Building, FloorMap } from '@/types';
import clsx from 'clsx';
import SearchResults from './SearchResults';

export interface ToolbarProps {
  buildings: Building[] | null;
  floorMap: FloorMap;
  activeBuilding: Building | null;
  floorOrdinal: number | null;
  setFloorOrdinal: (newOrdinal: number | null) => void;
  showBuilding: (newBuilding: Building | null, updateMap: boolean) => void;
}

export default function Toolbar({
  buildings,
  floorMap,
  activeBuilding,
  floorOrdinal,
  setFloorOrdinal,
  showBuilding,
}: ToolbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <div
        className={clsx(
          styles['search-modal-background'],
          isSearchOpen && styles['search-modal-background-active'],
        )}
        aria-hidden="true"
      />

      <div
        className={clsx(
          styles['search-modal'],
          isSearchOpen && styles['search-modal-open'],
        )}
        aria-hidden={isSearchOpen ? 'false' : 'true'}
      >
        <div className={styles['search-list']}>
          {buildings && (
            <SearchResults
              query={searchQuery}
              buildings={buildings}
              floorMap={floorMap}
              onSelectBuilding={(building: Building) => {
                showBuilding(building, true);
                setIsSearchOpen(false);
              }}
            />
          )}
        </div>
      </div>

      <div
        className={clsx(
          styles.toolbar,
          isSearchOpen && styles['toolbar-open'],
        )}
      >
        {activeBuilding && (
          <FloorSwitcher
            building={activeBuilding}
            ordinal={floorOrdinal!}
            isToolbarOpen={isSearchOpen}
            onOrdinalChange={setFloorOrdinal}
          />
        )}

        <div className={styles['search-box']}>
          <div className={styles['search-icon-wrapper']}>
            <MagnifyingGlassIcon className={styles['search-icon']} />
          </div>
          <button
            type="button"
            title="Close"
            className={clsx(
              styles['search-close-button'],
              isSearchOpen && styles['search-close-button-visible'],
            )}
            aria-hidden={isSearchOpen ? 'false' : 'true'}
            onClick={() => setIsSearchOpen(false)}
          >
            <ArrowLeftIcon className={styles['search-close-icon']} />
          </button>
          <input
            type="search"
            className={styles['search-box-input']}
            placeholder="Search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onFocus={() => setIsSearchOpen(true)}
          />
        </div>
      </div>
    </>
  );
}
