import React, { useState } from 'react';
import styles from '@/styles/Toolbar.module.css';
import {
  MagnifyingGlassIcon, ArrowLeftIcon,
} from '@heroicons/react/24/solid';
import FloorSwitcher from '@/components/FloorSwitcher';
import {
  Building,
  Floor,
  FloorMap,
  Room,
} from '@/types';
import clsx from 'clsx';
import useEscapeKey from '@/hooks/useEscapeKey';
import SearchResults from './SearchResults';

export interface ToolbarProps {
  buildings: Building[] | null;
  floorMap: FloorMap;
  activeBuilding: Building | null;
  floorOrdinal: number | null;
  setFloorOrdinal: (newOrdinal: number | null) => void;
  onSelectBuilding: (newBuilding: Building | null) => void;
  onSelectRoom: (selectedRoom: Room, building: Building, floor: Floor) => void;
  isSearchOpen: boolean;
  onSetIsSearchOpen: (boolean) => void;
}

export default function Toolbar({
  buildings,
  floorMap,
  activeBuilding,
  floorOrdinal,
  setFloorOrdinal,
  onSelectBuilding,
  onSelectRoom,
  isSearchOpen,
  onSetIsSearchOpen,
}: ToolbarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  useEscapeKey(() => {
    onSetIsSearchOpen(false);
  });

  return (
    <>
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
            ref={(node) => node && (
              isSearchOpen ? node.removeAttribute('inert') : node.setAttribute('inert', '')
            )}
            onClick={() => {
              onSetIsSearchOpen(false);
            }}
          >
            <ArrowLeftIcon className={styles['search-close-icon']} />
          </button>
          {!isSearchOpen && (
            <button
              type="button"
              aria-label="Open Search"
              className={clsx(
                styles['open-search-button'],
                !searchQuery && styles.placeholder,
              )}
              onClick={() => {
                onSetIsSearchOpen(true);
                // inputRef.current!.focus();
              }}
            >
              {searchQuery === '' ? 'Search' : searchQuery}
            </button>
          )}
        </div>
      </div>

      {isSearchOpen && (
        <input
          type="search"
          className={clsx(
            styles['search-box-input'],
          )}
          placeholder="Search"
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value);
          }}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />
      )}

      <div
        className={clsx(
          styles['search-modal-background'],
          isSearchOpen && styles['search-modal-background-active'],
        )}
        role="presentation"
      />

      <div
        className={clsx(
          styles['search-modal'],
          isSearchOpen && styles['search-modal-open'],
        )}
        ref={(node) => node && (
          isSearchOpen ? node.removeAttribute('inert') : node.setAttribute('inert', '')
        )}
      >
        <div className={styles['search-list']}>
          <div className={styles['search-list-scroll']}>
            {buildings && (
              <SearchResults
                query={searchQuery}
                buildings={buildings}
                floorMap={floorMap}
                onSelectBuilding={(building: Building) => {
                  onSelectBuilding(building);
                  onSetIsSearchOpen(false);
                }}
                onSelectRoom={(room: Room, building: Building, newFloor: Floor) => {
                  onSelectRoom(room, building, newFloor);
                  onSetIsSearchOpen(false);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
