/* eslint-disable no-bitwise */
import { Building, Floor } from '@/types';
import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronUpIcon, ChevronDownIcon,
} from '@heroicons/react/24/solid';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import styles from '@/styles/FloorSwitcher.module.css';
import clsx from 'clsx';
import { useIsDesktop } from '@/hooks/useWindowDimensions';
import Roundel from './Roundel';

interface FloorSwitcherProps {
  building: Building;
  ordinal: number;
  isToolbarOpen: boolean;
  onOrdinalChange: (newOrdinal: number) => void;
}

export function getFloorIndexAtOrdinal(building: Building, ordinal: number): number {
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

/**
 * The interface component allowing an user to see the current building
 * and switch floors.
 */
export default function FloorSwitcher({
  building,
  ordinal,
  isToolbarOpen,
  onOrdinalChange,
}: FloorSwitcherProps) {
  const [showFloorPicker, setShowFloorPicker] = useState<boolean>(false);

  // Hide the floor picker if the building or floor changes
  useEffect(() => setShowFloorPicker(false), [building, ordinal]);

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

  const floorPickerRef = useRef<HTMLDivElement | null>(null);

  const isDesktop = useIsDesktop();

  return (
    <div
      className={clsx(styles.wrapper)}
      ref={(node) => node && (
        (isToolbarOpen && !isDesktop) ? node.setAttribute('inert', '') : node.removeAttribute('inert')
      )}
    >
      <div
        className={clsx(
          styles['floor-switcher'],
          isToolbarOpen && styles['toolbar-open'],
        )}
      >
        <div className={styles['building-roundel-wrapper']}>
          <Roundel code={building.code} />
        </div>

        <div className={styles.views}>
          <div
            className={clsx(
              styles['default-view'],
              showFloorPicker && styles['view-hidden'],
            )}
            ref={(node) => node && (
              showFloorPicker ? node.setAttribute('inert', '') : node.removeAttribute('inert')
            )}
          >
            <span className={styles['building-name']}>
              {building.name}
            </span>

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
                  title="Select a floor"
                  className={clsx(styles.button, styles['current-floor'])}
                  onClick={() => {
                    setShowFloorPicker(true);

                    const floorPicker = floorPickerRef.current!;
                    const totalWidth = floorPicker.clientWidth;
                    const buttonWidth = 52;
                    floorPicker.scrollLeft = (floorIndex + 0.5) * buttonWidth - totalWidth / 2;
                  }}
                  disabled={building.floors.length < 2}
                >
                  {isFloorValid ? building.floors[floorIndex].name : '—'}
                  <span className={styles['ellipsis-indicator']}>
                    {
                      building.floors.map((floor: Floor) => (
                        <div
                          key={floor.ordinal}
                          className={clsx(
                            styles['ellipsis-dot'],
                            floor.ordinal === ordinal && styles['ellipsis-dot-active'],
                          )}
                        />
                      ))
                    }
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
          <div
            className={clsx(
              styles['floor-picker'],
              !showFloorPicker && styles['view-hidden'],
            )}
            ref={(node) => node && (
              showFloorPicker ? node.removeAttribute('inert') : node.setAttribute('inert', '')
            )}
          >
            <div className={styles['floor-picker-scroll']} ref={floorPickerRef}>
              {building.floors.map((floor: Floor) => (
                <button
                  key={floor.ordinal}
                  type="button"
                  className={clsx(
                    styles.button,
                    floor.ordinal === ordinal && styles['button-active'],
                  )}
                  onClick={() => {
                    setShowFloorPicker(false);
                    onOrdinalChange(floor.ordinal);
                  }}
                  role="tab"
                  aria-selected={floor.ordinal === ordinal ? 'true' : 'false'}
                >
                  {floor.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
