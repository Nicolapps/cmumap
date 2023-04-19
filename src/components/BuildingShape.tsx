import React from 'react';
import { Building } from '@/types';
import { Annotation, Polygon } from 'mapkit-react';
import clsx from 'clsx';
import styles from '../styles/BuildingShape.module.css';

interface BuildingShapeProps {
  building: Building;
  showName?: boolean;
}

export default function BuildingShape({
  building,
  showName = false,
}: BuildingShapeProps) {
  return (
    <>
      <Polygon
        key={`b-${building.code}`}
        points={building.shapes}
        fillColor={building.floors.length > 0 ? '#9ca3af' : '#6b7280'}
        fillOpacity={1}
        strokeColor={building.floors.length > 0 ? '#6b7280' : '#374151'}
        lineWidth={1}
        enabled={false}
      />

      {(showName || building.floors.length === 0) && (
        <Annotation
          latitude={building.labelPosition.latitude}
          longitude={building.labelPosition.longitude}
        >
          <span
            className={clsx(
              styles.marker,
              building.code.length > 2 && styles.condensed,
              building.code === 'WWG' && styles.condensed2,
            )}
          >
            {building.code}
          </span>
        </Annotation>
      )}
    </>
  );
}
