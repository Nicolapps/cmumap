/* eslint-disable no-bitwise */
import { Building } from '@/types';
import React from 'react';
import {
  ChevronUpIcon, ChevronDownIcon,
} from '@heroicons/react/24/solid';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import styles from '@/styles/FloorSwitcher.module.css';
import clsx from 'clsx';

interface FloorSwitcherProps {
  building: Building;
  ordinal: number;
  isToolbarOpen: boolean;
  onOrdinalChange: (newOrdinal: number) => void;
}

function getFloorIndexAtOrdinal(building: Building, ordinal: number): number {
  let min = 0;
  let max = building.floors.length - 1;
  while (min <= max) {
    const mid = (min + max) >>> 1; // = Math.floor((min + max) / 2)

    const midFloorOrdinal = building.floors[mid].ordinal;
    if (midFloorOrdinal === ordinal) { // found
      return mid;
    }

    if (midFloorOrdinal > ordinal) {
      max = mid - 1;
    } else {
      min = mid + 1;
    }
  }

  return ~min;
}

export default function FloorSwitcher({
  building,
  ordinal,
  isToolbarOpen,
  onOrdinalChange,
}: FloorSwitcherProps) {
  const floorIndex: number = getFloorIndexAtOrdinal(building, ordinal);
  const isFloorValid = floorIndex >= 0;

  const insertIndex = ~floorIndex;
  const canGoDown = (isFloorValid ? floorIndex : insertIndex) > 0;
  const canGoUp = isFloorValid
    ? floorIndex < building.floors.length - 1
    : ~floorIndex <= building.floors.length - 1;

  const lowerFloorIndex = isFloorValid
    ? floorIndex - 1
    : insertIndex - 1;
  const lowerFloorOrdinal = building.floors[lowerFloorIndex]?.ordinal;
  const upperFloorIndex = isFloorValid
    ? floorIndex + 1
    : insertIndex;
  const upperFloorOrdinal = building.floors[upperFloorIndex]?.ordinal;

  return (
    <div
      className={clsx(styles.wrapper, isToolbarOpen && styles['toolbar-open'])}
      aria-hidden={isToolbarOpen ? 'true' : 'false'}
    >
      <div className={styles['floor-switcher']}>
        <div className={styles.building}>
          <span className="floor-roundel">
            {building.code}
          </span>
          <span className={styles['building-name']}>
            {building.name}
          </span>
        </div>

        {building.floors.length !== 0 && (
          <>
            <button
              type="button"
              className={styles.button}
              title="Lower floor"
              disabled={!canGoDown}
              onClick={() => onOrdinalChange(lowerFloorOrdinal)}
            >
              <ChevronDownIcon className={styles['button-icon']} />
            </button>
            <button
              type="button"
              className={clsx(styles.button, styles['current-floor'])}
            >
              {isFloorValid ? building.floors[floorIndex].name : '—'}
              <span className={styles.more}>
                <EllipsisHorizontalIcon className={styles['more-icon']} />
              </span>
            </button>
            <button
              type="button"
              className={styles.button}
              title="Upper floor"
              disabled={!canGoUp}
              onClick={() => onOrdinalChange(upperFloorOrdinal)}
            >
              <ChevronUpIcon className={styles['button-icon']} />
            </button>
          </>
        )}

        {building.floors.length === 0 && (
          <p className={styles['no-floor']}>
            <ExclamationCircleIcon className={styles['no-floor-icon']} />
            <span>
              Floor plan
              <br />
              not available
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
