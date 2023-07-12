/* eslint-disable no-await-in-loop */

import { v } from 'convex/values';
// import cliProgress from 'cli-progress';
import { internal } from './_generated/api';
import {
  internalAction,
  internalMutation,
} from './_generated/server';

function encodeShape(points: { latitude: number, longitude: number }[]): ArrayBuffer {
  const array = new Float64Array(points.length * 2);
  for (let i = 0; i < points.length; i += 1) {
    array[2 * i] = points[i].longitude;
    array[2 * i + 1] = points[i].latitude;
  }
  return array.buffer;
}

export default internalAction({
  args: {},
  handler: async ({ runMutation }) => {
    const { buildings, floors } = await fetch('https://nicolapps.github.io/cmumap-data-mirror/export.json').then((r) => r.json());

    let i = 0;
    for (const building of buildings) {
      i += 1;
      console.log(`[${i}/${buildings.length}] ${building.name}`);

      await runMutation(internal.importData.addBuilding, {
        building: {
          ...building,
          // hitbox: encodeShape(building.hitbox),
          // shapes: building.shapes.map(encodeShape),
          floors: undefined,
        },
      });

      for (const { name, ordinal } of building.floors) {
        const placement = floors[`${building.code}-${name}`]?.placement ?? null;
        await runMutation(internal.importData.addFloor, {
          floor: {
            building: building.code,
            name,
            ordinal,
            placement,
            hasFloorPlan: placement !== null,
          },
          rooms: floors[`${building.code}-${name}`]?.rooms ?? [],
        });
      }
    }
  },
});

export const addBuilding = internalMutation({
  args: { building: v.any() },
  handler: async ({ db }, { building }) => db.insert('buildings', building),
});

export const addFloor = internalMutation({
  args: { floor: v.any(), rooms: v.array(v.any()) },
  handler: async ({ db }, { floor, rooms }) => {
    const floorId = await db.insert('floors', floor);
    for (const room of rooms) {
      await db.insert('rooms', {
        ...room,
        floorId,
      });
    }
  },
});
