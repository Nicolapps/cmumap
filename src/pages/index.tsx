'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import {
  FeatureVisibility,
  Map,
  MapType,
  PointOfInterestCategory,
} from 'mapkit-react';
import { Building, Floor } from '@/types';
import BuildingShape from '@/components/BuildingShape';
import FloorPlan from '@/components/FloorPlan';
import useWindowDimensions from '@/hooks/useWindowDimensions';

import {
  InformationCircleIcon, MagnifyingGlassIcon, ArrowLeftIcon,
  ChevronUpIcon, ChevronDownIcon,
} from '@heroicons/react/24/solid';

import {
  ChevronRightIcon, EllipsisHorizontalIcon,
} from '@heroicons/react/20/solid';
import useMapPosition from '@/hooks/useMapPosition';
import { isInPolygonCoordinates } from '@/geometry';

export default function Home() {
  const [buildings, setBuildings] = useState<Building[] | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showFloor, setShowFloor] = useState(false);
  const [showRoomNames, setShowRoomNames] = useState(false);

  const [activeBuilding, setActiveBuilding] = useState<Building | null>(null);

  const windowDimensions = useWindowDimensions();
  const isDesktop = windowDimensions
    && windowDimensions.width
    && windowDimensions.width >= 768;

  type FloorMap = { [code: string]: Floor };
  const [floors, setFloors] = useState<FloorMap>({});

  useEffect(() => {
    fetch('/data/export.json').then((r) => r.json()).then((response) => {
      setBuildings(response.buildings);
      setFloors(response.floors);
    });
  }, []);

  const initialRegion = useMemo(() => ({
    centerLatitude: 40.444,
    centerLongitude: -79.945,
    latitudeDelta: 0.006337455593801167,
    longitudeDelta: 0.011960061265583022,
  }), []);

  const mobileBottomPadding = showFloor ? 130 : 72;

  const onRegionChangeEnd = useMapPosition((region, density) => {
    const newShowFloors = density >= 300_000;
    setShowFloor(newShowFloors);
    setShowRoomNames(density >= 1_000_000);

    if (newShowFloors) {
      const center = {
        latitude: region.centerLatitude,
        longitude: region.centerLongitude,
      };
      const activeBuilding = buildings?.find((building: Building) => building.hitbox && isInPolygonCoordinates(building.hitbox, center)) ?? null;

      setActiveBuilding(activeBuilding);
    } else {
      setActiveBuilding(null);
    }
  });

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
          showsUserLocationControl
          allowWheelToZoom
          mapType={MapType.MutedStandard}
          paddingBottom={isDesktop ? 0 : mobileBottomPadding}
          paddingLeft={4}
          paddingRight={4}
          paddingTop={10}
          showsZoomControl={isDesktop}
          showsCompass={isDesktop ? FeatureVisibility.Adaptive : FeatureVisibility.Hidden}
          onRegionChangeEnd={onRegionChangeEnd}
        >
          {buildings && buildings.map((building) => (
            <BuildingShape
              key={building.code}
              building={building}
              showName={!showFloor}
            />
          ))}

          {showFloor && Object.entries(floors).map(([code, floor]) => (
            code.endsWith('4') && (
            <FloorPlan
              key={code}
              rooms={floor.rooms}
              placement={floor.placement}
              showRoomNames={showRoomNames}
              isBackground={!activeBuilding || !code.startsWith(activeBuilding?.code)}
            />
            )
          ))}
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
          {activeBuilding && (
            <div className={styles['floor-box-wrapper']}>
              <div className={styles['floor-box']}>
                <div className={styles['floor-box-title']}>
                  <span className={styles['floor-roundel']}>
                    {activeBuilding.code}
                  </span>
                  <span className={styles['floor-box-name']}>
                    {activeBuilding.name}
                  </span>
                </div>
                <button type="button" className={styles['floor-box-button']} title="Lower floor">
                  <ChevronDownIcon className={styles['floor-box-button-icon']} />
                </button>
                <button type="button" className={`${styles['floor-box-button']} ${styles['floor-box-current-floor']}`}>
                  4
                  <span className={styles['floor-box-more']}>
                    <EllipsisHorizontalIcon className={styles['floor-box-more-icon']} />
                  </span>
                </button>
                <button type="button" className={styles['floor-box-button']} title="Upper floor">
                  <ChevronUpIcon className={styles['floor-box-button-icon']} />
                </button>
              </div>
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
