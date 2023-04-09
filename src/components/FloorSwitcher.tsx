import { Building, Floor } from '@/types';
import React from 'react';
import {
  ChevronUpIcon, ChevronDownIcon,
} from '@heroicons/react/24/solid';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import styles from '@/styles/FloorSwitcher.module.css';
import clsx from 'clsx';

interface FloorSwitcherProps {
  building: Building;
  ordinal: number;
  isToolbarOpen: boolean;
}

export default function FloorSwitcher({ building, ordinal, isToolbarOpen }: FloorSwitcherProps) {
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
        <button type="button" className={styles.button} title="Lower floor">
          <ChevronDownIcon className={styles['button-icon']} />
        </button>
        <button type="button" className={clsx(styles.button, styles['current-floor'])}>
          1
          <span className={styles.more}>
            <EllipsisHorizontalIcon className={styles['more-icon']} />
          </span>
        </button>
        <button type="button" className={styles.button} title="Upper floor">
          <ChevronUpIcon className={styles['button-icon']} />
        </button>
      </div>
    </div>
  );
}
