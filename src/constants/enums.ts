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

export const getTitleForTrainingCategory = (category: string): string => {
  switch (category) {
    case TrainingCategory.SOCIAL:
      return 'Social';
    case TrainingCategory.OBEDIENCE:
      return 'Obedience';
    case TrainingCategory.POTTY:
      return 'Potty';
    case TrainingCategory.SOUNDS:
      return 'Sounds';
    case TrainingCategory.ITEMS:
      return 'Items';
    case TrainingCategory.CUSTOM:
      return 'Custom';
    default:
      return category;
  }
};

export const TrainingType = {
  SIT: 'sit',
  STAY: 'stay',
  LIE_DOWN: 'lieDown',
  STAND: 'stand',
  HEEL: 'heel',
  LEAVE_IT: 'leaveIt',
  DROP_IT: 'dropIt',
  COME: 'come',
  WAIT: 'wait',
  LOOK: 'look',
  PLACE: 'place',
  ADULT_PERSON: 'adultPerson',
  KIDS: 'kids',
  CARS: 'cars',
  TRUCKS: 'trucks',
  BICYCLES: 'bicycles',
  BUSES: 'buses',
  DOGS: 'dogs',
  CATS: 'cats',
  ANIMALS: 'animals',
  DOG_PARK: 'dogPark',
  HURRY_UP: 'hurryUp',
  TRAINS: 'trains',
  MUSIC: 'music',
  GUN_SHOT: 'gunShot',
  FIREWORKS: 'fireworks',
  DOOR_BELL: 'doorBell',
  BABY_CRY: 'babyCry',
  UMBRELLA: 'umbrella',
  CUTLERY: 'cutlery',
  CUSTOM: 'custom',
} as const;

/**
 * The web's getTitleForTrainingType switches on properties of the string it was
 * given, so every case misses and it always capitalises the raw value. Matching
 * what the page actually renders means doing the same here.
 */
export const getTitleForTrainingType = (type: string): string =>
  String(type).charAt(0).toUpperCase() + String(type).slice(1);

/** Which types each category offers, from getTypesForTrainingTypeCategory. */
export const getTypesForTrainingCategory = (category: string): string[] => {
  switch (category) {
    case TrainingCategory.SOCIAL:
      return [
        TrainingType.LOOK,
        TrainingType.ADULT_PERSON,
        TrainingType.KIDS,
        TrainingType.CARS,
        TrainingType.TRUCKS,
        TrainingType.BUSES,
        TrainingType.DOGS,
        TrainingType.CATS,
        TrainingType.ANIMALS,
        TrainingType.DOG_PARK,
        TrainingType.CUSTOM,
      ];
    case TrainingCategory.OBEDIENCE:
      return [
        TrainingType.SIT,
        TrainingType.STAY,
        TrainingType.LIE_DOWN,
        TrainingType.WAIT,
        TrainingType.STAND,
        TrainingType.HEEL,
        TrainingType.LEAVE_IT,
        TrainingType.DROP_IT,
        TrainingType.COME,
        TrainingType.PLACE,
        TrainingType.LOOK,
        TrainingType.CUSTOM,
      ];
    case TrainingCategory.POTTY:
      return [TrainingType.HURRY_UP, TrainingType.CUSTOM];
    case TrainingCategory.SOUNDS:
      return [
        TrainingType.TRAINS,
        TrainingType.MUSIC,
        TrainingType.GUN_SHOT,
        TrainingType.FIREWORKS,
        TrainingType.DOOR_BELL,
        TrainingType.BABY_CRY,
        TrainingType.CUSTOM,
      ];
    case TrainingCategory.ITEMS:
      return [TrainingType.UMBRELLA, TrainingType.CUTLERY, TrainingType.CUSTOM];
    default:
      return [TrainingType.CUSTOM];
  }
};

export const BreedSize = {
  EXTRA_SMALL: 'extraSmall',
  SMALL: 'small',
  MEDIUM_SMALL: 'mediumSmall',
  MEDIUM: 'medium',
  LARGE: 'large',
  EXTRA_LARGE: 'extraLarge',
} as const;

export const getBreedSizeTitle = (size: string): string => {
  switch (size) {
    case BreedSize.EXTRA_SMALL:
      return 'Extra Small';
    case BreedSize.SMALL:
      return 'Small';
    case BreedSize.MEDIUM_SMALL:
      return 'Medium Small';
    case BreedSize.MEDIUM:
      return 'Medium';
    case BreedSize.LARGE:
      return 'Large';
    case BreedSize.EXTRA_LARGE:
      return 'Extra Large';
    default:
      return 'Unknown Size';
  }
};

export const DogActivityType = {
  NEUTERED: 'neutered',
  INTACT: 'intact',
  INACTIVE: 'inactive',
  LOW_ACTIVITY: 'lowActivity',
  ACTIVE: 'active',
  MEDIUM: 'medium',
  HIGH: 'high',
  WORKING: 'working',
} as const;

export const getDogActivityTitle = (type: string): string => {
  switch (type) {
    case DogActivityType.NEUTERED:
      return 'Neutered dog';
    case DogActivityType.INTACT:
      return 'Intact dog';
    case DogActivityType.INACTIVE:
      return 'Inactive';
    case DogActivityType.LOW_ACTIVITY:
      return 'Low activity';
    case DogActivityType.ACTIVE:
      return 'Active';
    case DogActivityType.MEDIUM:
      return 'Medium active';
    case DogActivityType.HIGH:
      return 'High active';
    case DogActivityType.WORKING:
      return 'Working dog';
    default:
      return type;
  }
};

export const RatioPresets = {
  CUSTOM: 'custom',
  BARF_ADULT: 'barfAdult',
  BARF_PUPPY: 'barfPuppy',
  BARF_TRADITIONAL_ADULT: 'barfTraditionalAdult',
  BARF_TRADITIONAL_PUPPY: 'barfTraditionalPuppy',
  PMR_ADULT: 'pmrAdult',
  PMR_PUPPY: 'pmrPuppy',
  PMR_TRADITIONAL_ADULT: 'pmrTraditionalAdult',
  PMR_TRADITIONAL_PUPPY: 'pmrTraditionalPuppy',
} as const;

export const getRatioPresetsTitle = (type: string): string => {
  switch (type) {
    case RatioPresets.CUSTOM:
      return 'Custom ratio';
    case RatioPresets.BARF_ADULT:
      return 'BARF Adult';
    case RatioPresets.BARF_PUPPY:
      return 'BARF Puppy';
    case RatioPresets.BARF_TRADITIONAL_ADULT:
      return 'BARF Adult (traditional)';
    case RatioPresets.BARF_TRADITIONAL_PUPPY:
      return 'BARF Puppy (traditional)';
    case RatioPresets.PMR_ADULT:
      return 'PMR Adult';
    case RatioPresets.PMR_PUPPY:
      return 'PMR Puppy';
    case RatioPresets.PMR_TRADITIONAL_ADULT:
      return 'PMR Adult (traditional)';
    case RatioPresets.PMR_TRADITIONAL_PUPPY:
      return 'PMR Puppy (traditional)';
    default:
      return type;
  }
};

export const FoodUnits = {
  GRAM: 'gram',
  KG: 'kg',
  SERVING: 'serv',
  OZ: 'oz',
  LB: 'lb',
} as const;

export const FoodType = {
  TREAT: 'treat',
  RECIPE: 'recipe',
  FOOD: 'food',
  SUPPLEMENT: 'supplement',
  DRY_FOOD: 'dryFood',
  WET_FOOD: 'wetFood',
} as const;

/** The nutrition rows on the create/edit food forms, in web order. */
export const AddFoodRowType = {
  PROTEIN: 'protein',
  FAT: 'fat',
  FIBER: 'fiber',
  ASH: 'ash',
  CARB: 'carb',
  CALORIES: 'calories',
  SERVINGS: 'servings',
  CALORIES_SERVING: 'caloriesServing',
  SERVING_WEIGHT: 'servingWeight',
} as const;

export const getTitleForAddFoodRowType = (type: string): string => {
  switch (type) {
    case AddFoodRowType.PROTEIN:
      return 'Protein, %';
    case AddFoodRowType.FAT:
      return 'Fat, %';
    case AddFoodRowType.FIBER:
      return 'Fiber, %';
    case AddFoodRowType.ASH:
      return 'Ash, %';
    case AddFoodRowType.CARB:
      return 'Carbs, %';
    case AddFoodRowType.CALORIES:
      return 'Calories/100g';
    case AddFoodRowType.SERVINGS:
      return 'Number of servings';
    case AddFoodRowType.CALORIES_SERVING:
      return 'Serving calories, kcal';
    case AddFoodRowType.SERVING_WEIGHT:
      return 'Serving weight, g';
    default:
      return type;
  }
};

export const getTitleUpercased = (rawValue: string): string =>
  String(rawValue).charAt(0).toUpperCase() + String(rawValue).slice(1);

// --- Food categories -------------------------------------------------------

import * as colors from '../theme/colors';
import { DIET_PRESETS } from './index';

/** Display order used by the web's getIndexFoodCategory. */
export const getIndexFoodCategory = (category: string): number => {
  switch (category) {
    case FoodCategoryType.MEAT:
      return 1;
    case FoodCategoryType.BONES:
      return 2;
    case FoodCategoryType.GIBLETS:
      return 3;
    case FoodCategoryType.LIVER:
      return 4;
    case FoodCategoryType.VEGGIE:
      return 5;
    case FoodCategoryType.FRUITS:
      return 6;
    case FoodCategoryType.SEEDS:
      return 7;
    case FoodCategoryType.FISH:
      return 8;
    case FoodCategoryType.FIBER:
      return 9;
    case FoodCategoryType.OTHER:
      return 10;
    default:
      return 0;
  }
};

export const getColorFoodCategory = (category: string): string => {
  switch (category) {
    case FoodCategoryType.MEAT:
      return colors.meat;
    case FoodCategoryType.BONES:
      return colors.bones;
    case FoodCategoryType.LIVER:
      return colors.liver;
    case FoodCategoryType.GIBLETS:
      return colors.giblets;
    case FoodCategoryType.VEGGIE:
      return colors.veggie;
    case FoodCategoryType.FRUITS:
      return colors.fruits;
    case FoodCategoryType.SEEDS:
      return colors.seeds;
    case FoodCategoryType.FISH:
      return colors.fish;
    case FoodCategoryType.FIBER:
      return colors.fiber;
    case FoodCategoryType.OTHER:
      return colors.other;
    default:
      return colors.grayDark;
  }
};

export interface PresetCategory {
  index: number;
  type: string;
  name: string;
  weight: number;
  percentage: number;
  color: string;
  profileId?: string;
}

const buildCategory = (
  type: string,
  percentage: number,
  dailyPortion: number,
  profileId?: string
): PresetCategory => ({
  index: getIndexFoodCategory(type),
  type,
  name: getTitleUpercased(type),
  weight: (dailyPortion * percentage) / 100,
  percentage,
  color: getColorFoodCategory(type),
  profileId,
});

/** Every category, at zero — the web's getAllFoodCategories. */
export const getAllFoodCategories = (profileId?: string): PresetCategory[] =>
  Object.values(FoodCategoryType).map((type) =>
    buildCategory(type, 0, 0, profileId)
  );

/** Preset id → the ratios table in constants/index.ts. */
const PRESET_RATIOS: Record<string, Record<string, number>> = {
  [RatioPresets.BARF_ADULT]: DIET_PRESETS.BARF_ADULT,
  [RatioPresets.BARF_PUPPY]: DIET_PRESETS.BARF_PUPPY,
  [RatioPresets.BARF_TRADITIONAL_ADULT]: DIET_PRESETS.BARF_TRADITIONAL_ADULT,
  [RatioPresets.BARF_TRADITIONAL_PUPPY]: DIET_PRESETS.BARF_TRADITIONAL_PUPPY,
  [RatioPresets.PMR_ADULT]: DIET_PRESETS.PMR_ADULT,
  [RatioPresets.PMR_PUPPY]: DIET_PRESETS.PMR_PUPPY,
  [RatioPresets.PMR_TRADITIONAL_ADULT]: DIET_PRESETS.PMR_TRADITIONAL_ADULT,
  [RatioPresets.PMR_TRADITIONAL_PUPPY]: DIET_PRESETS.PMR_TRADITIONAL_PUPPY,
};

/** The web's getCategoriesForRatioPreset, driven by the ratios table. */
export const getCategoriesForRatioPreset = (
  dailyPortion: number,
  profileId: string,
  preset: string
): PresetCategory[] => {
  const ratios = PRESET_RATIOS[preset];
  if (!ratios) return [];
  return Object.entries(ratios)
    .map(([type, percentage]) =>
      buildCategory(type, percentage, dailyPortion, profileId)
    )
    .sort((a, b) => a.index - b.index);
};

/** RER — 70 × weight^0.75. */
export const calculateBaseRER = (weight: number): number =>
  70 * Math.pow(weight, 0.75);

/** RER scaled by the dog's activity type. */
export const calculateRER = (weight: number, type: string): number => {
  const baseRER = calculateBaseRER(weight);
  switch (type) {
    case DogActivityType.NEUTERED:
      return 1.6 * baseRER;
    case DogActivityType.INTACT:
      return 1.8 * baseRER;
    case DogActivityType.INACTIVE:
      return 1.2 * baseRER;
    case DogActivityType.LOW_ACTIVITY:
      return 1.4 * baseRER;
    case DogActivityType.ACTIVE:
      return 2.0 * baseRER;
    case DogActivityType.MEDIUM:
      return 3.0 * baseRER;
    case DogActivityType.HIGH:
      return 4.0 * baseRER;
    case DogActivityType.WORKING:
      return 5.0 * baseRER;
    default:
      return baseRER;
  }
};
