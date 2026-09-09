/**
 * Enums — port of the web app's helpers/Enums.helper.js.
 * Kept as plain objects with the same raw values, since they travel to the API.
 */

export const AlertType = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
} as const;

export const FilterFood = {
  ALL: 'All',
  CATEGORY: 'Category',
  CUSTOM: 'My food',
  RECIPE: 'Recipe',
} as const;

export const FilterStatistic = {
  CALORIES: 'Calories',
  ACTIVITIES: 'Activities',
  TRAININGS: 'Trainings',
} as const;

export const FoodCategoryType = {
  MEAT: 'meat',
  BONES: 'bones',
  LIVER: 'liver',
  GIBLETS: 'giblets',
  VEGGIE: 'veggie',
  FRUITS: 'fruits',
  SEEDS: 'seeds',
  FISH: 'fish',
  FIBER: 'fiber',
  OTHER: 'other',
} as const;

export const ActivityType = {
  WALK: 'walk',
  RUN: 'run',
  SWIM: 'swim',
  FETCH: 'fetch',
} as const;

export const getTitleForActivityType = (activity: string): string => {
  switch (activity) {
    case ActivityType.WALK:
      return 'Walk';
    case ActivityType.RUN:
      return 'Run';
    case ActivityType.SWIM:
      return 'Swim';
    case ActivityType.FETCH:
      return 'Fetch game';
    default:
      return activity;
  }
};

export const ActivityMetric = {
  DISTANCE: 'distance',
  DURATION: 'duration',
} as const;

export const getTitleForActivityMetric = (metric: string): string => {
  switch (metric) {
    case ActivityMetric.DISTANCE:
      return 'Distance, km';
    case ActivityMetric.DURATION:
      return 'Duration, min';
    default:
      return metric;
  }
};

export const TrainingCategory = {
  OBEDIENCE: 'obedience',
  SOCIAL: 'social',
  POTTY: 'potty',
  SOUNDS: 'sounds',
  ITEMS: 'items',
  CUSTOM: 'custom',
} as const;
