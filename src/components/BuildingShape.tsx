import React from 'react';
import { Building } from '@/types';
import { Annotation, Polygon } from 'mapkit-react';
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
        fillColor="#f3c8c4"
        fillOpacity={1}
        strokeColor="#df948e"
        lineWidth={2}
        enabled={false}
      />

      {showName && (
        <Annotation
          latitude={building.labelPosition.latitude}
          longitude={building.labelPosition.longitude}
        >
          <span className={`${styles.marker} ${building.code.length > 2 ? styles.condensed : ''} ${building.code === 'WWG' ? styles.condensed2 : ''}`}>
            {building.code}
          </span>
        </Annotation>
      )}
    </>
  );
}
