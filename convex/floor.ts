import { v } from 'convex/values';

import {
  query,
} from './_generated/server';

export default query({
  args: {
    id: v.id('floors'),
  },
  handler: async ({ db }, { id }) => {
    const floor = await db.get(id);
    if (!floor || !floor.hasFloorPlan) {
      throw new Error('Floor not found');
    }

    return ({
      placement: floor.placement,
      rooms: await db.query('rooms')
        .withIndex('by_floor', (q) => q.eq('floorId', id))
        .collect(),
    });
  },
});
