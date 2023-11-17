// FoodSection.js
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
  
  // FoodType.js
  export const FoodType = {
    TREAT: 'treat',
    RECIPE: 'recipe',
    FOOD: 'food',
    SUPPLEMENT: 'supplement',
    DRY_FOOD: 'dryFood',
    WET_FOOD: 'wetFood',
  };
  
  // FoodCategoryType.js
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

  export const getTitleUpercased= (rawValue) => {
    return String(rawValue).charAt(0).toUpperCase() + String(rawValue).slice(1);
  };
  
  // AddFoodRowType.js
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
    MEAT_RATIO: 'meatRatio',
    BONES_RATIO: 'bonesRatio',

    title(type){
      switch (type) {
        case 'protein':
          return 'Protein, %';
        case 'fat':
          return 'Fat, %';
        case 'fiber':
          return 'Fiber, %';
        case 'ash':
          return 'Ash, %';
        case 'carb':
          return 'Carbs, %';
        case 'calories':
          return 'Calories/100g';
        case 'servings':
          return 'Number of servings';
        case 'caloriesServing':
          return 'Serving calories, kcal';
        case 'servingWeight':
          return 'Serving weight, g';
        case 'meatRatioo':
          return 'Meat, %';
        case 'bonesRatio':
          return 'Bones, %';
        default:
          return type;
      }
    }
  };

// ActivityType.js
  export const ActivityType = {
    WALK: 'walk',
    RUN: 'run',
    SWIM: 'swim',
    FETCH: 'fetch',

  };

  export const getTitleForActivityType= (activity) => {
    switch (activity) {
        case ActivityType.WALK: return 'Walk';
        case ActivityType.RUN: return 'Run';
        case ActivityType.SWIM: return 'Swim';
        case ActivityType.FETCH: return 'Fetch game';
    }
  };

  export const getCaloriesForDistance= (activity) => {
    switch (activity) {
        case ActivityType.WALK: return 8;
        case ActivityType.RUN: return 8;
        case ActivityType.SWIM: return 8;
        case ActivityType.FETCH: return 8;
    }
};

export const getCaloriesForDuration= (activity) =>{
    switch (activity) {
        case ActivityType.WALK: return 64;
        case ActivityType.RUN: return 64;
        case ActivityType.SWIM: return 64;
        case ActivityType.FETCH: return 64;
    }
};

  // ActivityMetric.js
  export const ActivityMetric = {
    DISTANCE: 'distance',
    DURATION: 'duration',

    title(metric) {
        switch (metric) {
            case this.DISTANCE: return 'Distance, km';
            case this.DURATION: return 'Duration, min';
        }
    },
  };

  export const getTitleForActivityMetric= (metric) => {
    switch (metric) {
        case ActivityMetric.DISTANCE: return 'Distance, km';
        case ActivityMetric.DURATION: return 'Duration, min';
    }
  };

  export const getDDTitleForActivityMetric= (metric) => {
    switch (metric) {
        case ActivityMetric.DISTANCE: return 'Distance';
        case ActivityMetric.DURATION: return 'Duration';
    }
  };

  // TrainingCategory.js
  export const TrainingCategory = {
    SOCIAL: 'social',
    OBEDIENCE: 'obedience',
    POTTY: 'potty',
    SOUNDS: 'sounds',
    ITEMS: 'items',
    CUSTOM: 'custom',
  };

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
            case TrainingCategory.SOCIAL: return 'Social';
            case TrainingCategory.OBEDIENCE: return 'Obedience';
            case TrainingCategory.POTTY: return 'Potty';
            case TrainingCategory.SOUNDS: return 'Sounds';
            case TrainingCategory.ITEMS: return 'Items';
            case TrainingCategory.CUSTOM: return 'Custom';
        };
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
          return [
            TrainingType.HURRY_UP, 
            TrainingType.CUSTOM,
          ];
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
          return [
            TrainingType.UMBRELLA, 
            TrainingType.CUTLERY,
            TrainingType.CUSTOM,
          ];
        case TrainingCategory.CUSTOM:
          return [];
        default:
          return [];
      };
    };


  // TrainingType.js
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

  export const getTrainingTypeFor = (rawValue) => {
    for (const type in TrainingType) {
      if (TrainingType[type] === rawValue) {
        return TrainingType[type];
      }
    }
    return TrainingType.SIT;  
  };

  export const getTitleForTrainingType = (type) => {
    switch (type) {
      case type.LIE_DOWN: return 'Lie Down';
      case type.LEAVE_IT: return '"Leave It';
      case type.ADULT_PERSON: return 'Adult person';
      case type.DOG_PARK: return 'Dog park';
      case type.GUN_SHOT: return 'Gun Shot';
      case type.DOOR_BELL: return 'Door Bell';
      case type.BABY_CRY: return 'Baby Cry';
      case type.HURRY_UP: return 'Hurry Up';
      default: return String(type).charAt(0).toUpperCase() + String(type).slice(1);
   };
  };

 

  // FoodUnits.js
  export const FoodUnits = {
    GRAM: 'gram',
    KG: 'kg',
    SERVING: 'serv',
    OZ: 'oz',
    LB: 'lb',
  };
  