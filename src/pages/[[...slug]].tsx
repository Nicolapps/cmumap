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
  Coordinate,
  FeatureVisibility,
  Map,
  MapType,
  PointOfInterestCategory,
} from 'mapkit-react';
import {
  Building, Export, Floor, FloorMap,
} from '@/types';
import BuildingShape from '@/components/BuildingShape';
import FloorPlanOverlay from '@/components/FloorPlanOverlay';
import useWindowDimensions from '@/hooks/useWindowDimensions';

import { InformationCircleIcon } from '@heroicons/react/24/solid';

import useMapPosition from '@/hooks/useMapPosition';
import { isInPolygonCoordinates } from '@/geometry';
import { getFloorIndexAtOrdinal } from '@/components/FloorSwitcher';
import { useRouter } from 'next/router';
import Toolbar from '@/components/Toolbar';

const exportFile = 'https://nicolapps.github.io/cmumap-data-mirror/export.json';

export default function Home() {
  const router = useRouter();
  const mapRef = useRef<mapkit.Map | null>(null);

  const [buildings, setBuildings] = useState<Building[] | null>(null);

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

  const [floors, setFloors] = useState<FloorMap>({});

  const showBuilding = (newBuilding: Building | null, updateMap: boolean) => {
    setActiveBuilding(newBuilding);
    if (newBuilding === null) {
      return;
    }

    if (updateMap) {
      const points: Coordinate[] = newBuilding.shapes.flat();
      const allLat = points.map((p) => p.latitude);
      const allLon = points.map((p) => p.longitude);

      mapRef.current?.setRegionAnimated(new mapkit.BoundingRegion(
        Math.max(...allLat),
        Math.max(...allLon),
        Math.min(...allLat),
        Math.min(...allLon),
      ).toCoordinateRegion());
    }

    setFloorOrdinal((currentFloorOrdinal) => (
      (currentFloorOrdinal === null && newBuilding.floors.length > 0)
        ? newBuilding.floors
          .find((floor) => floor.name === newBuilding.defaultFloor)!
          .ordinal
        : currentFloorOrdinal
    ));
  };

  // Load the data from the API
  useEffect(() => {
    fetch(exportFile)
      .then((r) => r.json())
      .then((response: Export) => {
        setBuildings(response.buildings);
        setFloors(response.floors);

        // Handle the URL
        const [buildingCode, floorName] = (router.query?.slug?.[0] ?? '').toUpperCase().split('-');
        const building = buildingCode && response.buildings.find((b) => b.code === buildingCode)!;
        if (building) {
          showBuilding(building, true);
          setShowFloor(true);
          setShowRoomNames(false);

          const floor = building.floors.find(({ name }) => name === floorName)!;
          if (floor) {
            setFloorOrdinal(floor.ordinal);
          }
        } else {
          // Redirect to the default page
          router.push('/', undefined, { shallow: true });
        }
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update the URL from the current floor
  useEffect(() => {
    if (!buildings) return;

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

  const { onRegionChangeStart, onRegionChangeEnd } = useMapPosition((region, density) => {
    if (!buildings) return;

    const newShowFloors = density >= 200_000;
    setShowFloor(newShowFloors);
    setShowRoomNames(density >= 750_000);

    if (newShowFloors) {
      const center = {
        latitude: region.centerLatitude,
        longitude: region.centerLongitude,
      };
      const centerBuilding = buildings.find((building: Building) => (
        building.hitbox
        && isInPolygonCoordinates(building.hitbox, center)
      )) ?? null;

      showBuilding(centerBuilding, false);
    } else {
      setActiveBuilding(null);
      setFloorOrdinal(null);
    }
  }, mapRef, initialRegion);

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

        <Toolbar
          buildings={buildings}
          floorMap={floors}
          activeBuilding={activeBuilding}
          floorOrdinal={floorOrdinal}
          setFloorOrdinal={setFloorOrdinal}
          onSelectBuilding={(building) => {
            setFloorOrdinal(null);
            showBuilding(building, true);
          }}
        />
      </main>
    </>
  );
}

// Disable SSR
export async function getServerSideProps() {
  return {
    props: {}, // will be passed to the page component as props
  };
}
