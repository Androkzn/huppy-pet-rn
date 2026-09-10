/**
 * Diet presets and energy requirements.
 *
 * A preset decides how the daily portion is split between meat, bone, organ
 * and plant matter, and the RER decides how much energy the dog needs at all.
 * Both are the numbers an owner acts on, so the tables are asserted directly.
 */

import {
  ActivityMetric,
  ActivityType,
  BreedSize,
  DogActivityType,
  FoodCategoryType,
  RatioPresets,
  TrainingCategory,
  TrainingType,
  calculateBaseRER,
  calculateRER,
  getAllFoodCategories,
  getBreedSizeTitle,
  getCategoriesForRatioPreset,
  getColorFoodCategory,
  getDogActivityTitle,
  getIndexFoodCategory,
  getRatioPresetsTitle,
  getTitleForActivityMetric,
  getTitleForActivityType,
  getTitleForTrainingCategory,
  getTitleUpercased,
  getTypesForTrainingCategory,
} from '../enums';

describe('getCategoriesForRatioPreset', () => {
  it('splits BARF Adult into the classic 70/10/5/5/7/2/1', () => {
    const categories = getCategoriesForRatioPreset(1000, 'p1', RatioPresets.BARF_ADULT);
    const byType = Object.fromEntries(
      categories.map((c) => [c.type, c.percentage])
    );

    expect(byType).toEqual({
      meat: 70,
      bones: 10,
      liver: 5,
      giblets: 5,
      veggie: 7,
      seeds: 2,
      fruits: 1,
    });
  });

  it('always adds up to the whole portion', () => {
    for (const preset of Object.values(RatioPresets)) {
      if (preset === RatioPresets.CUSTOM) continue;
      const total = getCategoriesForRatioPreset(1000, 'p1', preset).reduce(
        (sum, c) => sum + c.percentage,
        0
      );
      expect({ preset, total }).toEqual({ preset, total: 100 });
    }
  });

  it('turns each share into grams of the daily portion', () => {
    const categories = getCategoriesForRatioPreset(500, 'p1', RatioPresets.BARF_ADULT);
    const meat = categories.find((c) => c.type === 'meat');

    expect(meat?.weight).toBe(350);
  });

  it('orders categories the way the diet is built up', () => {
    const categories = getCategoriesForRatioPreset(1000, 'p1', RatioPresets.PMR_ADULT);
    const indexes = categories.map((c) => c.index);

    expect(indexes).toEqual([...indexes].sort((a, b) => a - b));
    expect(categories[0].type).toBe('meat');
  });

  it('has nothing to offer for a custom ratio', () => {
    expect(getCategoriesForRatioPreset(1000, 'p1', RatioPresets.CUSTOM)).toEqual([]);
  });

  it('carries the profile through, so added categories belong to it', () => {
    const categories = getCategoriesForRatioPreset(1000, 'p9', RatioPresets.BARF_PUPPY);
    expect(categories.every((c) => c.profileId === 'p9')).toBe(true);
  });
});

describe('getAllFoodCategories', () => {
  it('offers every category, unallocated', () => {
    const all = getAllFoodCategories('p1');

    expect(all).toHaveLength(Object.values(FoodCategoryType).length);
    expect(all.every((c) => c.percentage === 0 && c.weight === 0)).toBe(true);
  });

  it('gives each category its own colour', () => {
    const colors = getAllFoodCategories('p1').map((c) => c.color);
    expect(new Set(colors).size).toBeGreaterThan(1);
    expect(getColorFoodCategory('meat')).not.toBe(getColorFoodCategory('bones'));
  });

  it('indexes every category distinctly', () => {
    const indexes = Object.values(FoodCategoryType).map(getIndexFoodCategory);
    expect(new Set(indexes).size).toBe(indexes.length);
  });
});

describe('resting energy requirement', () => {
  it('follows 70 × weight^0.75', () => {
    expect(calculateBaseRER(10)).toBeCloseTo(70 * Math.pow(10, 0.75), 6);
  });

  it('scales the requirement by how active the dog is', () => {
    const inactive = calculateRER(10, DogActivityType.INACTIVE);
    const active = calculateRER(10, DogActivityType.ACTIVE);
    const working = calculateRER(10, DogActivityType.WORKING);

    expect(inactive).toBeLessThan(active);
    expect(active).toBeLessThan(working);
    expect(working).toBeCloseTo(calculateBaseRER(10) * 5, 6);
  });

  it('falls back to the base requirement for an unknown activity type', () => {
    expect(calculateRER(10, 'nonsense')).toBeCloseTo(calculateBaseRER(10), 6);
  });
});

describe('titles', () => {
  it('names every activity type and metric', () => {
    expect(getTitleForActivityType(ActivityType.FETCH)).toBe('Fetch game');
    expect(getTitleForActivityMetric(ActivityMetric.DISTANCE)).toBe('Distance, km');
    expect(getTitleForActivityMetric(ActivityMetric.DURATION)).toBe('Duration, min');
  });

  it('names every breed size, activity level and preset', () => {
    for (const size of Object.values(BreedSize)) {
      expect(getBreedSizeTitle(size)).not.toBe('Unknown Size');
    }
    for (const type of Object.values(DogActivityType)) {
      expect(getDogActivityTitle(type)).not.toBe(type);
    }
    for (const preset of Object.values(RatioPresets)) {
      expect(getRatioPresetsTitle(preset)).not.toBe(preset);
    }
  });

  it('names every training category', () => {
    for (const category of Object.values(TrainingCategory)) {
      expect(getTitleForTrainingCategory(category)).not.toBe(category);
    }
  });

  it('capitalises a raw value for display', () => {
    expect(getTitleUpercased('dryFood')).toBe('DryFood');
    expect(getTitleUpercased('')).toBe('');
  });
});

describe('getTypesForTrainingCategory', () => {
  it('offers the types that belong to the category', () => {
    expect(getTypesForTrainingCategory(TrainingCategory.OBEDIENCE)).toContain(
      TrainingType.SIT
    );
    expect(getTypesForTrainingCategory(TrainingCategory.SOUNDS)).toContain(
      TrainingType.FIREWORKS
    );
  });

  it('always leaves room for a custom one', () => {
    for (const category of Object.values(TrainingCategory)) {
      expect(getTypesForTrainingCategory(category)).toContain(TrainingType.CUSTOM);
    }
  });

  it('falls back to custom alone for an unknown category', () => {
    expect(getTypesForTrainingCategory('nonsense')).toEqual([TrainingType.CUSTOM]);
  });
});
