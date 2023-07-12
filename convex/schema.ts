import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  buildings: defineTable({
    code: v.string(),
    defaultFloor: v.string(),
    hitbox: v.bytes(),
    labelPosition: v.object({ latitude: v.float64(), longitude: v.float64() }),
    name: v.string(),
    osmId: v.union(v.null(), v.string()),
    shapes: v.array(v.bytes()),
  }),
  floors: defineTable({
    building: v.string(),
    hasFloorPlan: v.boolean(),
    name: v.string(),
    ordinal: v.float64(),
    placement: v.object({
      angle: v.float64(),
      center: v.object({ latitude: v.float64(), longitude: v.float64() }),
      scale: v.float64(),
    }),
  }),
  rooms: defineTable({
    alias: v.optional(v.string()),
    comment: v.optional(v.string()),
    floorId: v.id('floors'),
    id: v.string(),
    labelPosition: v.object({ x: v.float64(), y: v.float64() }),
    labelPositionExtracted: v.optional(
      v.object({ x: v.float64(), y: v.float64() }),
    ),
    name: v.string(),
    shapes: v.array(v.array(v.object({ x: v.float64(), y: v.float64() }))),
    sourceNameAttribute: v.optional(v.string()),
    sourceNameLabel: v.optional(v.string()),
    type: v.string(),
    warning: v.optional(v.string()),
  })
    .index('by_floor', ['floorId']),
});
