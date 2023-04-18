'use client';

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import {
  FeatureVisibility,
  Map,
  MapType,
  PointOfInterestCategory,
} from 'mapkit-react';
import { Building, Floor, FloorPlan } from '@/types';
import BuildingShape from '@/components/BuildingShape';
import FloorPlanOverlay from '@/components/FloorPlanOverlay';
import useWindowDimensions from '@/hooks/useWindowDimensions';

import {
  InformationCircleIcon, MagnifyingGlassIcon, ArrowLeftIcon,
} from '@heroicons/react/24/solid';

import { ChevronRightIcon } from '@heroicons/react/20/solid';
import useMapPosition from '@/hooks/useMapPosition';
import { isInPolygonCoordinates } from '@/geometry';
import FloorSwitcher, { getFloorIndexAtOrdinal } from '@/components/FloorSwitcher';
import { useRouter } from 'next/router';

const exportFile = 'https://nicolapps.github.io/cmumap-data-mirror/export.json';

export default function Home() {
  const router = useRouter();

  const [buildings, setBuildings] = useState<Building[] | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showFloor, setShowFloor] = useState(false);
  const [showRoomNames, setShowRoomNames] = useState(false);

  const [activeBuilding, setActiveBuilding] = useState<Building | null>(null);
  const [floorOrdinal, setFloorOrdinal] = useState<number | null>(null);
  const currentFloorName = (floorOrdinal !== null) && activeBuilding
    ?.floors[getFloorIndexAtOrdinal(activeBuilding, floorOrdinal)]?.name;

  const windowDimensions = useWindowDimensions();
  const isDesktop = windowDimensions
    && windowDimensions.width
    && windowDimensions.width >= 768;

  type FloorMap = { [code: string]: FloorPlan };
  const [floors, setFloors] = useState<FloorMap>({});

  // Load the data from the API
  useEffect(() => {
    fetch(exportFile).then((r) => r.json()).then((response) => {
      setBuildings(response.buildings);
      setFloors(response.floors);
    });
  }, []);

  // Update the URL from the current floor
  useEffect(() => {
    let url;
    if (!activeBuilding) {
      url = '/';
    } else if (!currentFloorName) {
      url = `/${activeBuilding.code}`;
    } else {
      url = `/${activeBuilding.code}-${currentFloorName}`;
    }

    router.push(url, undefined, {
      shallow: true,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBuilding, currentFloorName]);

  const initialRegion = useMemo(() => ({
    centerLatitude: 40.444,
    centerLongitude: -79.945,
    latitudeDelta: 0.006337455593801167,
    longitudeDelta: 0.011960061265583022,
  }), []);

  const mobileBottomPadding = showFloor ? 130 : 72;

  const mapRef = useRef<mapkit.Map | null>(null);

  const { onRegionChangeStart, onRegionChangeEnd } = useMapPosition((region, density) => {
    // @TODO Set initial floor

    const newShowFloors = density >= 200_000;
    setShowFloor(newShowFloors);
    setShowRoomNames(density >= 750_000);

    if (newShowFloors) {
      const center = {
        latitude: region.centerLatitude,
        longitude: region.centerLongitude,
      };
      const centerBuilding = buildings?.find((building: Building) => (
        building.hitbox
        && isInPolygonCoordinates(building.hitbox, center)
      )) ?? null;

      setActiveBuilding(centerBuilding);

      // Use the default floor
      if (floorOrdinal === null && centerBuilding && centerBuilding.floors.length > 0) {
        const defaultFloorOrdinal = centerBuilding.floors
          .find((floor) => floor.name === centerBuilding.defaultFloor)!
          .ordinal;
        setFloorOrdinal(defaultFloorOrdinal);
      }
    } else {
      setActiveBuilding(null);
      setFloorOrdinal(null);
    }
  }, mapRef);

  let title = '';
  if (activeBuilding) {
    title += activeBuilding.name;
    if (currentFloorName) {
      title += ` ${currentFloorName}`;
    }
    title += ' — ';
  }
  title += 'CMU Map';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.main}>
        <button className={styles['info-button']} type="button" title="Help">
          <InformationCircleIcon className={styles['info-button-icon']} />
        </button>

        <Map
          ref={mapRef}
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
          showsZoomControl={!!isDesktop}
          showsCompass={isDesktop ? FeatureVisibility.Adaptive : FeatureVisibility.Hidden}
          onRegionChangeStart={onRegionChangeStart}
          onRegionChangeEnd={onRegionChangeEnd}
        >
          {buildings && buildings.map((building) => (
            <BuildingShape
              key={building.code}
              building={building}
              showName={!showFloor}
            />
          ))}

          {showFloor && buildings && buildings.flatMap((building: Building) => building
            .floors.map((floor: Floor) => {
              if (floor.ordinal !== floorOrdinal) return null;

              const code = `${building.code}-${floor.name}`;
              const floorPlan = floors[code];

              return floorPlan && (
                <FloorPlanOverlay
                  key={code}
                  floorPlan={floorPlan}
                  showRoomNames={showRoomNames}
                  isBackground={building.code !== activeBuilding?.code}
                />
              );
            }))}
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
                <span className="floor-roundel">
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
