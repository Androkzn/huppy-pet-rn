import * as colors from '../components/styles/Colors';

// Enum FilterFood definition
export const FilterFood = {
  ALL: 'All',
  CATEGORY: 'Category',
  CUSTOM: 'My food',
  RECIPE: 'Recipe',
};

// Enum FilterStatistic definition
export const FilterStatistic = {
  CALORIES: 'Calories',
  ACTIVITIES: 'Activities',
  TRAININGS: 'Trainings',
};

// Enum FoodSection definition
export const FoodSection = {
  TREAT: 'treat',
  RECIPE: 'recipe',
  SUPPLEMENT: 'supplement',
  DRY_FOOD: 'dryFood',
  WET_FOOD: 'wetFood',
  MEAT: 'meat',
  BONES: 'bones',
  LIVER: 'liver',
  GIBLETS: 'giblets',
  VEGGIE: 'veggie',
  FRUITS: 'fruits',
  SEEDS: 'seeds',
  FISH: 'fish',
  FIBER: 'fiber',
};

// Enum FoodType definition
export const FoodType = {
  TREAT: 'treat',
  RECIPE: 'recipe',
  FOOD: 'food',
  SUPPLEMENT: 'supplement',
  DRY_FOOD: 'dryFood',
  WET_FOOD: 'wetFood',
};

// Enum FoodCategoryType definition
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
};
// Enum FoodCategoryType methods
export const getTitleUpercased = (rawValue) => {
  const title =
    String(rawValue).charAt(0).toUpperCase() + String(rawValue).slice(1);
  return title;
};

export const basePercentageFoodCategory = (category) => {
  switch (category) {
    case FoodCategoryType.MEAT:
      return 50;
    case FoodCategoryType.BONES:
      return 20;
    case FoodCategoryType.LIVER:
      return 10;
    case FoodCategoryType.GIBLETS:
      return 15;
    case FoodCategoryType.VEGGIE:
      return 5;
    case FoodCategoryType.FRUITS:
      return 0;
    case FoodCategoryType.SEEDS:
      return 0;
    case FoodCategoryType.FISH:
      return 0;
    case FoodCategoryType.FIBER:
      return 0;
    case FoodCategoryType.OTHER:
      return 0;
    default:
      return 0;
  }
};

export const getIndexFoodCategory = (category) => {
  switch (category) {
    case FoodCategoryType.MEAT:
      return 1;
    case FoodCategoryType.BONES:
      return 2;
    case FoodCategoryType.LIVER:
      return 4;
    case FoodCategoryType.GIBLETS:
      return 3;
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

export const getColorFoodCategory = (category) => {
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

export const getAllFoodCategories = (profileId) => {
  return [
    {
      index: getIndexFoodCategory(FoodCategoryType.MEAT),
      type: FoodCategoryType.MEAT,
      name: getTitleUpercased(FoodCategoryType.MEAT),
      weight: 0,
      percentage: 0,
      color: getColorFoodCategory(FoodCategoryType.MEAT),
    },
    {
      index: getIndexFoodCategory(FoodCategoryType.BONES),
      type: FoodCategoryType.BONES,
      name: getTitleUpercased(FoodCategoryType.BONES),
      weight: 0,
      percentage: 0,
      color: getColorFoodCategory(FoodCategoryType.BONES),
    },
    {
      index: getIndexFoodCategory(FoodCategoryType.LIVER),
      type: FoodCategoryType.LIVER,
      name: getTitleUpercased(FoodCategoryType.LIVER),
      weight: 0,
      percentage: 0,
      color: getColorFoodCategory(FoodCategoryType.LIVER),
    },
    {
      index: getIndexFoodCategory(FoodCategoryType.GIBLETS),
      type: FoodCategoryType.GIBLETS,
      name: getTitleUpercased(FoodCategoryType.GIBLETS),
      weight: 0,
      percentage: 0,
      color: getColorFoodCategory(FoodCategoryType.GIBLETS),
    },
    {
      index: getIndexFoodCategory(FoodCategoryType.VEGGIE),
      type: FoodCategoryType.VEGGIE,
      name: getTitleUpercased(FoodCategoryType.VEGGIE),
      weight: 0,
      percentage: 0,
      color: getColorFoodCategory(FoodCategoryType.VEGGIE),
    },
    {
      index: getIndexFoodCategory(FoodCategoryType.SEEDS),
      type: FoodCategoryType.SEEDS,
      name: getTitleUpercased(FoodCategoryType.SEEDS),
      weight: 0,
      percentage: 0,
      color: getColorFoodCategory(FoodCategoryType.SEEDS),
    },
    {
      index: getIndexFoodCategory(FoodCategoryType.FRUITS),
      type: FoodCategoryType.FRUITS,
      name: getTitleUpercased(FoodCategoryType.FRUITS),
      weight: 0,
      percentage: 0,
      color: getColorFoodCategory(FoodCategoryType.FRUITS),
    },
    {
      index: getIndexFoodCategory(FoodCategoryType.FISH),
      type: FoodCategoryType.FISH,
      name: getTitleUpercased(FoodCategoryType.FISH),
      weight: 0,
      percentage: 0,
      color: getColorFoodCategory(FoodCategoryType.FISH),
    },
    {
      index: getIndexFoodCategory(FoodCategoryType.FIBER),
      type: FoodCategoryType.FIBER,
      name: getTitleUpercased(FoodCategoryType.FIBER),
      weight: 0,
      percentage: 0,
      color: getColorFoodCategory(FoodCategoryType.FIBER),
    },
    // {
    //   index: getIndexFoodCategory(FoodCategoryType.OTHER),
    //   type: FoodCategoryType.OTHER,
    //   name: getTitleUpercased(FoodCategoryType.OTHER),
    //   weight: 0,
    //   percentage: 0,
    //   color: getColorFoodCategory(FoodCategoryType.OTHER),
    // },
  ];
};

// Enum AddFoodRowType definition
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
};

// Enum AddFoodRowType methods
export const getTitleForAddFoodRowType = (type) => {
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
    case AddFoodRowType.MEAT_RATIO:
      return 'Meat, %';
    case AddFoodRowType.BONES_RATIO:
      return 'Bones, %';
    default:
      return type;
  }
};

// Enum ActivityType definition
export const ActivityType = {
  WALK: 'walk',
  RUN: 'run',
  SWIM: 'swim',
  FETCH: 'fetch',
};

// Enum ActivityType methods
export const getTitleForActivityType = (activity) => {
  switch (activity) {
    case ActivityType.WALK:
      return 'Walk';
    case ActivityType.RUN:
      return 'Run';
    case ActivityType.SWIM:
      return 'Swim';
    case ActivityType.FETCH:
      return 'Fetch game';
  }
};

export const getCaloriesForDistance = (activity) => {
  switch (activity) {
    case ActivityType.WALK:
      return 8;
    case ActivityType.RUN:
      return 8;
    case ActivityType.SWIM:
      return 8;
    case ActivityType.FETCH:
      return 8;
  }
};

export const getCaloriesForDuration = (activity) => {
  switch (activity) {
    case ActivityType.WALK:
      return 64;
    case ActivityType.RUN:
      return 64;
    case ActivityType.SWIM:
      return 64;
    case ActivityType.FETCH:
      return 64;
  }
};

// Enum ActivityMetric definition
export const ActivityMetric = {
  DISTANCE: 'distance',
  DURATION: 'duration',
};

// Enum ActivityMetric methods
export const getTitleForActivityMetric = (metric) => {
  switch (metric) {
    case ActivityMetric.DISTANCE:
      return 'Distance, km';
    case ActivityMetric.DURATION:
      return 'Duration, min';
  }
};

export const getDDTitleForActivityMetric = (metric) => {
  switch (metric) {
    case ActivityMetric.DISTANCE:
      return 'Distance, km';
    case ActivityMetric.DURATION:
      return 'Duration, min';
  }
};

// Enum TrainingCategory definition
export const TrainingCategory = {
  OBEDIENCE: 'obedience',
  SOCIAL: 'social',
  POTTY: 'potty',
  SOUNDS: 'sounds',
  ITEMS: 'items',
  CUSTOM: 'custom',
};

// Enum TrainingCategory methods
export const getTrainingCategoryFor = (rawValue) => {
  for (const category in TrainingCategory) {
    if (TrainingCategory[category] === rawValue) {
      return TrainingCategory[category];
    }
  }
  return TrainingCategory.SOCIAL;
};

export const getTitleForTrainingCategory = (category) => {
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
  }
};

export const getTypesForTrainingTypeCategory = (category) => {
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
    case TrainingCategory.CUSTOM:
      return [];
    default:
      return [];
  }
};

// Enum TrainingType definition
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
};

// Enum TrainingType methods
export const getTrainingTypeFor = function (rawValue) {
  for (const type in TrainingType) {
    if (TrainingType[type] === rawValue) {
      return TrainingType[type];
    }
  }
  return TrainingType.SIT;
};

export const getTitleForTrainingType = (type) => {
  switch (type) {
    case type.LIE_DOWN:
      return 'Lie Down';
    case type.LEAVE_IT:
      return '"Leave It';
    case type.ADULT_PERSON:
      return 'Adult person';
    case type.DOG_PARK:
      return 'Dog park';
    case type.GUN_SHOT:
      return 'Gun Shot';
    case type.DOOR_BELL:
      return 'Door Bell';
    case type.BABY_CRY:
      return 'Baby Cry';
    case type.HURRY_UP:
      return 'Hurry Up';
    default:
      return String(type).charAt(0).toUpperCase() + String(type).slice(1);
  }
};

// Enum FoodUnits definition
export const FoodUnits = {
  GRAM: 'gram',
  KG: 'kg',
  SERVING: 'serv',
  OZ: 'oz',
  LB: 'lb',
};

// Enum BreedSize definition
export const BreedSize = {
  EXTRA_SMALL: 'extraSmall',
  SMALL: 'small',
  MEDIUM_SMALL: 'mediumSmall',
  MEDIUM: 'medium',
  LARGE: 'large',
  EXTRA_LARGE: 'extraLarge',
};

// Enum BreedSize methods
export const getBreedSizeTitle = (size) => {
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

// Enum DogActivityType definition
export const DogActivityType = {
  NEUTERED: 'neutered',
  INTACT: 'intact',
  INACTIVE: 'inactive',
  LOW_ACTIVITY: 'lowActivity',
  ACTIVE: 'active',
  MEDIUM: 'medium',
  HIGH: 'high',
  WORKING: 'working',
};

// Enum DogActivityType methods
export const getDogActivityTitle = (type) => {
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
  }
};

export const calculateRER = function (weight, type) {
  const baseRER = DogActivityType.calculateBaseRER(weight);
  let RER;

  switch (type) {
    case DogActivityType.NEUTERED:
      RER = 1.6 * baseRER;
      break;
    case DogActivityType.INTACT:
      RER = 1.8 * baseRER;
      break;
    case DogActivityType.INACTIVE:
      RER = 1.2 * baseRER;
      break;
    case DogActivityType.LOW_ACTIVITY:
      RER = 1.4 * baseRER;
      break;
    case DogActivityType.ACTIVE:
      RER = 2.0 * baseRER;
      break;
    case DogActivityType.MEDIUM:
      RER = 3.0 * baseRER;
      break;
    case DogActivityType.HIGH:
      RER = 4.0 * baseRER;
      break;
    case DogActivityType.WORKING:
      RER = 5.0 * baseRER;
      break;
  }

  return RER;
};

export const calculateBaseRER = function (weight) {
  return 70 * Math.pow(weight, 0.75);
};

// Enum RatioPresets definition
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
};

// Enum RatioPresets methods
export const getRatioPresetsTitle = function (type) {
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
  }
};

// Function to get category for type
export const getDefaultCategory = function (type, profileId) {
  return {
    index: getIndexFoodCategory(type),
    type: type,
    name: getTitleUpercased(type),
    weight: 0,
    percentage: 0,
    color: getColorFoodCategory(type),
    profileId: profileId,
  };
};

// Function to calculate categories
export const getCategoriesForRatioPreset = function (
  dailyPortion,
  profileId,
  type
) {
  switch (type) {
    case RatioPresets.BARF_ADULT:
      return [
        {
          index: getIndexFoodCategory(FoodCategoryType.MEAT),
          type: FoodCategoryType.MEAT,
          name: getTitleUpercased(FoodCategoryType.MEAT),
          weight: (dailyPortion * 70) / 100,
          percentage: 70,
          color: getColorFoodCategory(FoodCategoryType.MEAT),
          profileId: profileId,
        },
        {
          index: getIndexFoodCategory(FoodCategoryType.BONES),
          type: FoodCategoryType.BONES,
          name: getTitleUpercased(FoodCategoryType.BONES),
          weight: (dailyPortion * 10) / 100,
          percentage: 10,
          color: getColorFoodCategory(FoodCategoryType.BONES),
          profileId: profileId,
        },
        {
          index: getIndexFoodCategory(FoodCategoryType.LIVER),
          type: FoodCategoryType.LIVER,
          name: getTitleUpercased(FoodCategoryType.LIVER),
          weight: (dailyPortion * 5) / 100,
          percentage: 5,
          color: getColorFoodCategory(FoodCategoryType.LIVER),
          profileId: profileId,
        },
        {
          index: getIndexFoodCategory(FoodCategoryType.GIBLETS),
          type: FoodCategoryType.GIBLETS,
          name: getTitleUpercased(FoodCategoryType.GIBLETS),
          weight: (dailyPortion * 5) / 100,
          percentage: 5,
          color: getColorFoodCategory(FoodCategoryType.GIBLETS),
          profileId: profileId,
        },
        {
          index: getIndexFoodCategory(FoodCategoryType.VEGGIE),
          type: FoodCategoryType.VEGGIE,
          name: getTitleUpercased(FoodCategoryType.VEGGIE),
          weight: (dailyPortion * 7) / 100,
          percentage: 7,
          color: getColorFoodCategory(FoodCategoryType.VEGGIE),
          profileId: profileId,
        },
        {
          index: getIndexFoodCategory(FoodCategoryType.SEEDS),
          type: FoodCategoryType.SEEDS,
          name: getTitleUpercased(FoodCategoryType.SEEDS),
          weight: (dailyPortion * 2) / 100,
          percentage: 2,
          color: getColorFoodCategory(FoodCategoryType.SEEDS),
          profileId: profileId,
        },
        {
          index: getIndexFoodCategory(FoodCategoryType.FRUITS),
          type: FoodCategoryType.FRUITS,
          name: getTitleUpercased(FoodCategoryType.FRUITS),
          weight: (dailyPortion * 1) / 100,
          percentage: 1,
          color: getColorFoodCategory(FoodCategoryType.FRUITS),
          profileId: profileId,
        },
      ];
    case RatioPresets.BARF_PUPPY:
      return [
        {
          index: getIndexFoodCategory(FoodCategoryType.MEAT),
          type: FoodCategoryType.MEAT,
          name: getTitleUpercased(FoodCategoryType.MEAT),
          weight: (dailyPortion * 58) / 100,
          percentage: 58,
          color: getColorFoodCategory(FoodCategoryType.MEAT),
          profileId: profileId,
        },
        {
          index: getIndexFoodCategory(FoodCategoryType.BONES),
          type: FoodCategoryType.BONES,
          name: getTitleUpercased(FoodCategoryType.BONES),
          weight: (dailyPortion * 17) / 100,
          percentage: 17,
          color: getColorFoodCategory(FoodCategoryType.BONES),
          profileId: profileId,
        },
        {
          index: getIndexFoodCategory(FoodCategoryType.LIVER),
          type: FoodCategoryType.LIVER,
          name: getTitleUpercased(FoodCategoryType.LIVER),
          weight: (dailyPortion * 7) / 100,
          percentage: 7,
          color: getColorFoodCategory(FoodCategoryType.LIVER),
          profileId: profileId,
        },
        {
          index: getIndexFoodCategory(FoodCategoryType.GIBLETS),
          type: FoodCategoryType.GIBLETS,
          name: getTitleUpercased(FoodCategoryType.GIBLETS),
          weight: (dailyPortion * 7) / 100,
          percentage: 7,
          color: getColorFoodCategory(FoodCategoryType.GIBLETS),
          profileId: profileId,
        },
        {
          index: getIndexFoodCategory(FoodCategoryType.VEGGIE),
          type: FoodCategoryType.VEGGIE,
          name: getTitleUpercased(FoodCategoryType.VEGGIE),
          eight: (dailyPortion * 7) / 100,
          percentage: 7,
          color: getColorFoodCategory(FoodCategoryType.VEGGIE),
          profileId: profileId,
        },
        {
          index: getIndexFoodCategory(FoodCategoryType.SEEDS),
          type: FoodCategoryType.SEEDS,
          name: getTitleUpercased(FoodCategoryType.SEEDS),
          weight: (dailyPortion * 3) / 100,
          percentage: 3,
          color: getColorFoodCategory(FoodCategoryType.SEEDS),
          profileId: profileId,
        },
        {
          index: getIndexFoodCategory(FoodCategoryType.FRUITS),
          type: FoodCategoryType.FRUITS,
          name: getTitleUpercased(FoodCategoryType.FRUITS),
          weight: (dailyPortion * 1) / 100,
          percentage: 1,
          color: getColorFoodCategory(FoodCategoryType.FRUITS),
          profileId: profileId,
        },
      ];
    case RatioPresets.BARF_TRADITIONAL_ADULT:
      return [
        {
          index: getIndexFoodCategory(FoodCategoryType.MEAT),
          type: FoodCategoryType.MEAT,
          name: getTitleUpercased(FoodCategoryType.MEAT),
          weight: (dailyPortion * 70) / 100,
          percentage: 70,
          color: getColorFoodCategory(FoodCategoryType.MEAT),
          profileId: profileId,
        },
        {
          index: getIndexFoodCategory(FoodCategoryType.BONES),
          type: FoodCategoryType.BONES,
          name: getTitleUpercased(FoodCategoryType.BONES),
          weight: (dailyPortion * 10) / 100,
          percentage: 10,
          color: getColorFoodCategory(FoodCategoryType.BONES),
          profileId: profileId,
        },
        {
          index: getIndexFoodCategory(FoodCategoryType.LIVER),
          type: FoodCategoryType.LIVER,
          name: getTitleUpercased(FoodCategoryType.LIVER),
          weight: (dailyPortion * 5) / 100,
          percentage: 5,
          color: getColorFoodCategory(FoodCategoryType.LIVER),
          profileId: profileId,
        },
        {
          index: getIndexFoodCategory(FoodCategoryType.GIBLETS),
          type: FoodCategoryType.GIBLETS,
          name: getTitleUpercased(FoodCategoryType.GIBLETS),
          weight: (dailyPortion * 5) / 100,
          percentage: 5,
          color: getColorFoodCategory(FoodCategoryType.GIBLETS),
          profileId: profileId,
        },
        {
          index: getIndexFoodCategory(FoodCategoryType.VEGGIE),
          type: FoodCategoryType.VEGGIE,
          name: getTitleUpercased(FoodCategoryType.VEGGIE),
          weight: (dailyPortion * 10) / 100,
          percentage: 10,
          color: getColorFoodCategory(FoodCategoryType.VEGGIE),
          profileId: profileId,
        },
      ];

    case RatioPresets.BARF_TRADITIONAL_PUPPY:
      return [
        {
          index: getIndexFoodCategory(FoodCategoryType.MEAT),
          type: FoodCategoryType.MEAT,
          name: getTitleUpercased(FoodCategoryType.MEAT),
          weight: (dailyPortion * 58) / 100,
          percentage: 58,
          color: getColorFoodCategory(FoodCategoryType.MEAT),
          profileId: profileId,
        },
        {
          index: getIndexFoodCategory(FoodCategoryType.BONES),
          type: FoodCategoryType.BONES,
          name: getTitleUpercased(FoodCategoryType.BONES),
          weight: (dailyPortion * 17) / 100,
          percentage: 17,
          color: getColorFoodCategory(FoodCategoryType.BONES),
          profileId: profileId,
        },
        {
          index: getIndexFoodCategory(FoodCategoryType.LIVER),
          type: FoodCategoryType.LIVER,
          name: getTitleUpercased(FoodCategoryType.LIVER),
          weight: (dailyPortion * 7) / 100,
          percentage: 7,
          color: getColorFoodCategory(FoodCategoryType.LIVER),
          profileId: profileId,
        },
        {
          index: getIndexFoodCategory(FoodCategoryType.GIBLETS),
          type: FoodCategoryType.GIBLETS,
          name: getTitleUpercased(FoodCategoryType.GIBLETS),
          weight: (dailyPortion * 8) / 100,
          percentage: 8,
          color: getColorFoodCategory(FoodCategoryType.GIBLETS),
          profileId: profileId,
        },
        {
          index: getIndexFoodCategory(FoodCategoryType.VEGGIE),
          type: FoodCategoryType.VEGGIE,
          name: getTitleUpercased(FoodCategoryType.VEGGIE),
          weight: (dailyPortion * 10) / 100,
          percentage: 10,
          color: getColorFoodCategory(FoodCategoryType.VEGGIE),
          profileId: profileId,
        },
      ];

    case RatioPresets.PMR_ADULT:
      return [
        {
          index: getIndexFoodCategory(FoodCategoryType.MEAT),
          type: FoodCategoryType.MEAT,
          name: getTitleUpercased(FoodCategoryType.MEAT),
          weight: (dailyPortion * 78) / 100,
          percentage: 78,
          color: getColorFoodCategory(FoodCategoryType.MEAT),
          profileId: profileId,
        },
        {
          index: getIndexFoodCategory(FoodCategoryType.BONES),
          type: FoodCategoryType.BONES,
          name: getTitleUpercased(FoodCategoryType.BONES),
          weight: (dailyPortion * 10) / 100,
          percentage: 10,
          color: getColorFoodCategory(FoodCategoryType.BONES),
          profileId: profileId,
        },
        {
          index: getIndexFoodCategory(FoodCategoryType.LIVER),
          type: FoodCategoryType.LIVER,
          name: getTitleUpercased(FoodCategoryType.LIVER),
          weight: (dailyPortion * 5) / 100,
          percentage: 5,
          color: getColorFoodCategory(FoodCategoryType.LIVER),
          profileId: profileId,
        },
        {
          index: getIndexFoodCategory(FoodCategoryType.GIBLETS),
          type: FoodCategoryType.GIBLETS,
          name: getTitleUpercased(FoodCategoryType.GIBLETS),
          weight: (dailyPortion * 5) / 100,
          percentage: 5,
          color: getColorFoodCategory(FoodCategoryType.GIBLETS),
          profileId: profileId,
        },
        {
          index: getIndexFoodCategory(FoodCategoryType.FIBER),
          type: FoodCategoryType.FIBER,
          name: getTitleUpercased(FoodCategoryType.FIBER),
          weight: (dailyPortion * 7) / 100,
          percentage: 7,
          color: getColorFoodCategory(FoodCategoryType.FIBER),
          profileId: profileId,
        },
      ];

    case RatioPresets.PMR_PUPPY:
      return [
        {
          index: getIndexFoodCategory(FoodCategoryType.MEAT),
          type: FoodCategoryType.MEAT,
          name: getTitleUpercased(FoodCategoryType.MEAT),
          weight: (dailyPortion * 67) / 100,
          percentage: 67,
          color: getColorFoodCategory(FoodCategoryType.MEAT),
          profileId: profileId,
        },
        {
          index: getIndexFoodCategory(FoodCategoryType.BONES),
          type: FoodCategoryType.BONES,
          name: getTitleUpercased(FoodCategoryType.BONES),
          weight: (dailyPortion * 17) / 100,
          percentage: 17,
          color: getColorFoodCategory(FoodCategoryType.BONES),
          profileId: profileId,
        },
        {
          index: getIndexFoodCategory(FoodCategoryType.LIVER),
          type: FoodCategoryType.LIVER,
          name: getTitleUpercased(FoodCategoryType.LIVER),
          weight: (dailyPortion * 7) / 100,
          percentage: 7,
          color: getColorFoodCategory(FoodCategoryType.LIVER),
          profileId: profileId,
        },
        {
          index: getIndexFoodCategory(FoodCategoryType.GIBLETS),
          type: FoodCategoryType.GIBLETS,
          name: getTitleUpercased(FoodCategoryType.GIBLETS),
          weight: (dailyPortion * 7) / 100,
          percentage: 7,
          color: getColorFoodCategory(FoodCategoryType.GIBLETS),
          profileId: profileId,
        },
        {
          index: getIndexFoodCategory(FoodCategoryType.FIBER),
          type: FoodCategoryType.FIBER,
          name: getTitleUpercased(FoodCategoryType.FIBER),
          weight: (dailyPortion * 2) / 100,
          percentage: 2,
          color: getColorFoodCategory(FoodCategoryType.FIBER),
          profileId: profileId,
        },
      ];

    case RatioPresets.PMR_TRADITIONAL_ADULT:
      return [
        {
          index: getIndexFoodCategory(FoodCategoryType.MEAT),
          type: FoodCategoryType.MEAT,
          name: getTitleUpercased(FoodCategoryType.MEAT),
          weight: (dailyPortion * 80) / 100,
          percentage: 80,
          color: getColorFoodCategory(FoodCategoryType.MEAT),
          profileId: profileId,
        },
        {
          index: getIndexFoodCategory(FoodCategoryType.BONES),
          type: FoodCategoryType.BONES,
          name: getTitleUpercased(FoodCategoryType.BONES),
          weight: (dailyPortion * 10) / 100,
          percentage: 10,
          color: getColorFoodCategory(FoodCategoryType.BONES),
          profileId: profileId,
        },
        {
          index: getIndexFoodCategory(FoodCategoryType.LIVER),
          type: FoodCategoryType.LIVER,
          name: getTitleUpercased(FoodCategoryType.LIVER),
          weight: (dailyPortion * 5) / 100,
          percentage: 5,
          color: getColorFoodCategory(FoodCategoryType.LIVER),
          profileId: profileId,
        },
        {
          index: getIndexFoodCategory(FoodCategoryType.GIBLETS),
          type: FoodCategoryType.GIBLETS,
          name: getTitleUpercased(FoodCategoryType.GIBLETS),
          weight: (dailyPortion * 5) / 100,
          percentage: 5,
          color: getColorFoodCategory(FoodCategoryType.GIBLETS),
          profileId: profileId,
        },
      ];

    case RatioPresets.PMR_TRADITIONAL_PUPPY:
      return [
        {
          index: getIndexFoodCategory(FoodCategoryType.MEAT),
          type: FoodCategoryType.MEAT,
          name: getTitleUpercased(FoodCategoryType.MEAT),
          weight: (dailyPortion * 69) / 100,
          percentage: 69,
          color: getColorFoodCategory(FoodCategoryType.MEAT),
          profileId: profileId,
        },
        {
          index: getIndexFoodCategory(FoodCategoryType.BONES),
          type: FoodCategoryType.BONES,
          name: getTitleUpercased(FoodCategoryType.BONES),
          weight: (dailyPortion * 17) / 100,
          percentage: 17,
          color: getColorFoodCategory(FoodCategoryType.BONES),
          profileId: profileId,
        },
        {
          index: getIndexFoodCategory(FoodCategoryType.LIVER),
          type: FoodCategoryType.LIVER,
          name: getTitleUpercased(FoodCategoryType.LIVER),
          weight: (dailyPortion * 7) / 100,
          percentage: 7,
          color: getColorFoodCategory(FoodCategoryType.LIVER),
          profileId: profileId,
        },
        {
          index: getIndexFoodCategory(FoodCategoryType.GIBLETS),
          type: FoodCategoryType.GIBLETS,
          name: getTitleUpercased(FoodCategoryType.GIBLETS),
          weight: (dailyPortion * 7) / 100,
          percentage: 7,
          color: getColorFoodCategory(FoodCategoryType.GIBLETS),
          profileId: profileId,
        },
      ];
  }
};
