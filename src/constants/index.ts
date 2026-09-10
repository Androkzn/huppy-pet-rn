/**
 * Diet ratio presets.
 *
 * Each preset splits the daily portion between muscle meat, bone, organ and
 * plant matter; muscle meat absorbs whatever the other components do not take,
 * so every preset totals 100%.
 */

export const DIET_PRESETS = {
  BARF_ADULT: {
    meat: 70,
    bones: 10,
    liver: 5,
    giblets: 5,
    veggie: 7,
    seeds: 2,
    fruits: 1,
  },
  BARF_PUPPY: {
    meat: 58,
    bones: 17,
    liver: 7,
    giblets: 7,
    veggie: 7,
    seeds: 3,
    fruits: 1,
  },
  BARF_TRADITIONAL_ADULT: {
    meat: 70,
    bones: 10,
    liver: 5,
    giblets: 5,
    veggie: 10,
  },
  BARF_TRADITIONAL_PUPPY: {
    meat: 58,
    bones: 17,
    liver: 7,
    giblets: 8,
    veggie: 10,
  },
  // Muscle meat absorbs whatever the other components do not take, as in every
  // other preset: the traditional split is 80/10/5/5, so adding 7% fiber takes
  // the meat share to 73. It read 78 here, which totalled 105% — every category
  // goal came out 5% high, and the "unused" figure went negative.
  PMR_ADULT: {
    meat: 73,
    bones: 10,
    liver: 5,
    giblets: 5,
    fiber: 7,
  },
  PMR_PUPPY: {
    meat: 67,
    bones: 17,
    liver: 7,
    giblets: 7,
    fiber: 2,
  },
  PMR_TRADITIONAL_ADULT: {
    meat: 80,
    bones: 10,
    liver: 5,
    giblets: 5,
  },
  PMR_TRADITIONAL_PUPPY: {
    meat: 69,
    bones: 17,
    liver: 7,
    giblets: 7,
  },
} as const;
