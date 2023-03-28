'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import { Map, MapType, PointOfInterestCategory } from 'mapkit-react';
import { Building, Placement, Room } from '@/types';
import BuildingShape from '@/components/BuildingShape';
import FloorPlan from '@/components/FloorPlan';

export default function Home() {
  const [buildings, setBuildings] = useState<Building[] | null>(null);
  const [placement, setPlacement] = useState<Placement | null>(null);
  const [floorPlan, setFloorPlan] = useState<Room[] | null>(null);

  useEffect(() => {
    fetch('/data/buildings.json').then((r) => r.json()).then((b) => setBuildings(b));
  }, []);

  useEffect(() => {
    fetch('/data/TCS-2.json').then((r) => r.json()).then(({ placement, rooms }) => {
      console.log(placement);
      console.log(rooms);
      setPlacement(placement);
      setFloorPlan(rooms);
    });
  }, []);

  // const initialRegion = useMemo(() => ({
  //   centerLatitude: 40.444,
  //   centerLongitude: -79.945,
  //   latitudeDelta: 0.006337455593801167,
  //   longitudeDelta: 0.011960061265583022,
  // }), []);
  const initialRegion = useMemo(() => ({
    centerLatitude: 40.444879,
    centerLongitude: -79.947156,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  }), []);

  return (
    <>
      <Head>
        <title>CMU Map</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.main}>
        <Map
          token={process.env.NEXT_PUBLIC_MAPKITJS_TOKEN!}
          initialRegion={initialRegion}
          includedPOICategories={[
            PointOfInterestCategory.PublicTransport,
          ]}
          allowWheelToZoom
          mapType={MapType.MutedStandard}
        >
          {buildings && buildings.map((building) => (
            <BuildingShape
              key={building.code}
              building={building}
              showName={building.code !== 'TCS'}
            />
          ))}

          {buildings && placement && floorPlan && (
            <FloorPlan
              rooms={floorPlan}
              placement={placement}
            />
          )}
        </Map>
      </main>
    </>
  );
}
