import React from 'react';
import { Building } from '@/types';
import { Annotation, Polygon } from 'mapkit-react';
import styles from '../styles/BuildingShape.module.css';
import Roundel from './Roundel';

interface BuildingShapeProps {
  building: Building;
  showName?: boolean;
}

/**
 * The shape of a building on the map.
 */
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
          <div className={styles['roundel-wrapper']}>
            <Roundel code={building.code} />
          </div>
        </Annotation>
      )}
    </>
  );
}
