/* eslint-disable no-await-in-loop */

import { v } from 'convex/values';
import { api, internal } from './_generated/api.js';
import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from './_generated/server';

export default internalAction({
  args: {},
  handler: async ({ runMutation }) => {
    const { buildings, floors } = await fetch('https://nicolapps.github.io/cmumap-data-mirror/export.json').then((r) => r.json());

    for (const building of buildings) {
      await runMutation(internal.importData.addBuilding, { building });

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
    db.insert('buildings', building);
  },
});

export const addFloor = internalMutation({
  args: { floor: v.any() },
  handler: async ({ db }, { floor }) => {
    db.insert('floors', floor);
  },
});

export const addRoom = internalMutation({
  args: { room: v.any() },
  handler: async ({ db }, { room }) => {
    db.insert('rooms', room);
  },
});
