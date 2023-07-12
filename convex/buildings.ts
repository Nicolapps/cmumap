import groupBy from 'lodash/groupBy';
import {
  query,
} from './_generated/server';

export default query(async ({ db }) => {
  const floorsSrc = await db.query('floors').collect();
  const floorsByBuilding = groupBy(floorsSrc, (floor) => floor.building);

  return (await db.query('buildings').collect()).map((building) => ({
    ...building,
    floors: (floorsByBuilding[building.code] ?? [])
      .sort((a, b) => b.ordinal - a.ordinal)
      .map(({
        _id, name, ordinal, hasFloorPlan,
      }) => ({
        id: hasFloorPlan ? _id : null,
        name,
        ordinal,
      })),
    _id: undefined,
    _creationTime: undefined,
  }));
});
