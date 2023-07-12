import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  buildings: defineTable({
    code: v.string(),
    defaultFloor: v.string(),
    hitbox: v.array(
      v.object({ latitude: v.float64(), longitude: v.float64() }),
    ),
    labelPosition: v.object({ latitude: v.float64(), longitude: v.float64() }),
    name: v.string(),
    osmId: v.union(v.null(), v.string()),
    shapes: v.array(
      v.array(v.object({ latitude: v.float64(), longitude: v.float64() })),
    ),
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
    type: v.union(
      v.literal('default'),
      v.literal('corridor'),
      v.literal('auditorium'),
      v.literal('office'),
      v.literal('classroom'),
      v.literal('operational'),
      v.literal('conference'),
      v.literal('study'),
      v.literal('laboratory'),
      v.literal('computer lab'),
      v.literal('studio'),
      v.literal('workshop'),
      v.literal('vestibule'),
      v.literal('storage'),
      v.literal('restroom'),
      v.literal('stairs'),
      v.literal('elevator'),
      v.literal('ramp'),
      v.literal('dining'),
      v.literal('store'),
      v.literal('library'),
      v.literal('sport'),
      v.literal('parking'),
    ),
    warning: v.optional(v.string()),
  }).index('by_floor', ['floorId']),
});
