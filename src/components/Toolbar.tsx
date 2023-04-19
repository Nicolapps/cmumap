import React, { useState } from 'react';
import styles from '@/styles/Toolbar.module.css';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import {
  MagnifyingGlassIcon, ArrowLeftIcon,
} from '@heroicons/react/24/solid';
import FloorSwitcher from '@/components/FloorSwitcher';
import { Building } from '@/types';

export interface ToolbarProps {
  buildings: Building[] | null;
  activeBuilding: Building | null;
  floorOrdinal: number | null;
  setFloorOrdinal: (newOrdinal: number | null) => void;
  showBuilding: (newBuilding: Building | null, updateMap: boolean) => void;
}

export default function Toolbar({
  buildings,
  activeBuilding,
  floorOrdinal,
  setFloorOrdinal,
  showBuilding,
}: ToolbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <div
        className={`${styles['search-modal-background']} ${isSearchOpen ? styles['search-modal-background-active'] : ''}`}
        aria-hidden="true"
      />

      <div
        className={`${styles['search-modal']} ${isSearchOpen ? styles['search-modal-open'] : ''}`}
        aria-hidden={isSearchOpen ? 'false' : 'true'}
      >
        <div className={styles['search-list']}>
          {buildings && buildings.map((building: Building) => building.code !== 'BH-PH' && (
            <button
              type="button"
              className={styles['search-list-element']}
              key={building.code}
              onClick={() => {
                showBuilding(building, true);
                setIsSearchOpen(false);
              }}
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
        </div>
      </div>

      <div className={`${styles.toolbar} ${isSearchOpen ? styles['toolbar-open'] : ''}`}>
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
            className={`${styles['search-close-button']} ${isSearchOpen ? styles['search-close-button-visible'] : ''}`}
            aria-hidden={isSearchOpen ? 'false' : 'true'}
            onClick={() => setIsSearchOpen(false)}
          >
            <ArrowLeftIcon className={styles['search-close-icon']} />
          </button>
          <input
            type="search"
            className={styles['search-box-input']}
            placeholder="Search"
            onFocus={() => setIsSearchOpen(true)}
          />
        </div>
      </div>
    </>
  );
}
