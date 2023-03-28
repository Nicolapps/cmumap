'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import { Map, MapType, PointOfInterestCategory } from 'mapkit-react';
import { Building, Placement, Room } from '@/types';
import BuildingShape from '@/components/BuildingShape';
import FloorPlan from '@/components/FloorPlan';

import {
  InformationCircleIcon, MagnifyingGlassIcon, ArrowLeftIcon,
  ChevronUpIcon, ChevronDownIcon,
} from '@heroicons/react/24/solid';

import {
  ChevronRightIcon
} from '@heroicons/react/20/solid';

const showFloor = true;

export default function Home() {
  const [buildings, setBuildings] = useState<Building[] | null>(null);
  const [placement, setPlacement] = useState<Placement | null>(null);
  const [floorPlan, setFloorPlan] = useState<Room[] | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    fetch('/data/buildings.json').then((r) => r.json()).then((b) => setBuildings(b));
  }, []);

  useEffect(() => {
    fetch('/data/TCS-2.json').then((r) => r.json()).then(({ placement, rooms }) => {
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
        <button className={styles['info-button']} type="button" title="Help">
          <InformationCircleIcon className={styles['info-button-icon']} />
        </button>

        <Map
          token={process.env.NEXT_PUBLIC_MAPKITJS_TOKEN!}
          initialRegion={initialRegion}
          includedPOICategories={[
            PointOfInterestCategory.PublicTransport,
          ]}
          showsMapTypeControl={false}
          showsUserLocationControl={true}
          allowWheelToZoom
          mapType={MapType.MutedStandard}
          paddingBottom={showFloor ? 130 : 72}
          paddingLeft={4}
          paddingRight={4}
          paddingTop={10}
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
              >
                <span className={styles['floor-roundel']}>
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
          {showFloor && (
            <div className={styles['floor-box']}>
              <div className={styles['floor-box-title']}>
                <span className={styles['floor-roundel']}>
                  TCS
                </span>
                <span className={styles['floor-box-name']}>
                  TCS Hall
                </span>
              </div>
              <button type="button" className={styles['floor-box-button']} title="Lower floor">
                <ChevronDownIcon className={styles['floor-box-button-icon']} />
              </button>
              <button type="button" className={`${styles['floor-box-button']} ${styles['floor-box-current-floor']}`}>
                2
              </button>
              <button type="button" className={styles['floor-box-button']} title="Upper floor">
                <ChevronUpIcon className={styles['floor-box-button-icon']} />
              </button>
            </div>
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
      </main>
    </>
  );
}
