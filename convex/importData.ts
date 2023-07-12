/* eslint-disable no-await-in-loop */

import { v } from 'convex/values';
// import cliProgress from 'cli-progress';
import { internal } from './_generated/api';
import {
  internalAction,
  internalMutation,
} from './_generated/server';

export default internalAction({
  args: {},
  handler: async ({ runMutation }) => {
    const { buildings, floors } = await fetch('https://nicolapps.github.io/cmumap-data-mirror/export.json').then((r) => r.json());

    let i = 0;
    for (const building of buildings) {
      i += 1;
      console.log(`[${i}/${buildings.length}] ${building.name}`);

      const buildingId = await runMutation(internal.importData.addBuilding, { building });

      for (const { name, ordinal } of building.floors) {
        const placement = floors[`${building.code}-${name}`]?.placement ?? null;
        await runMutation(internal.importData.addFloor, {
          floor: {
            buildingId,
            name,
            ordinal,
            placement,
            hasFloorPlan: placement !== null,
          },
        });

        const rooms = floors[`${building.code}-${name}`]?.rooms ?? [];
        for (const room of rooms) {
          await runMutation(internal.importData.addRoom, { room });
        }
      }
    }
  },
});

export const addBuilding = internalMutation({
  args: { building: v.any() },
  handler: async ({ db }, { building }) => {
    await db.insert('buildings', building);
  },
});

export const addFloor = internalMutation({
  args: { floor: v.any() },
  handler: async ({ db }, { floor }) => {
    await db.insert('floors', floor);
  },
});

export const addRoom = internalMutation({
  args: { room: v.any() },
  handler: async ({ db }, { room }) => {
    await db.insert('rooms', room);
  },
});
