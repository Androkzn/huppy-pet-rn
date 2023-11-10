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
  
  // AddFoodRowType.js
  export const AddFoodRowType = {
    PROTEIN: 'protein',
    FAT: 'fat',
    FIBER: 'fiber',
    ASH: 'ash',
    CARB: 'carb',
    CALORIES: 'calories',
    SERVINGS: 'servings',
    CALORIES_SERVING: 'calories_serving',
    SERVING_WEIGHT: 'serving_weight',
    MEAT_RATIO: 'meat_ratio',
    BONES_RATIO: 'bones_ratio',

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
        case 'calories_serving':
          return 'Serving calories, kcal';
        case 'serving_weight':
          return 'Serving weight, g';
        case 'meat_ratio':
          return 'Meat, %';
        case 'bones_ratio':
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
    
    title(activity) {
        switch (activity) {
            case this.WALK: return 'Walk';
            case this.RUN: return 'Run';
            case this.SWIM: return 'Swim';
            case this.FETCH: return 'Fetch game';
        }
    },
    
    caloriesForDistance(activity) {
        switch (activity) {
            case this.WALK: return 8;
            case this.RUN: return 8;
            case this.SWIM: return 8;
            case this.FETCH: return 8;
        }
    },
    
    caloriesForDuration(activity) {
        switch (activity) {
            case this.WALK: return 64;
            case this.RUN: return 64;
            case this.SWIM: return 64;
            case this.FETCH: return 64;
        }
    },
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

  // TrainingCategory.js
  export const TrainingCategory = {
    SOCIAL: 'social',
    OBEDIENCE: 'obedience',
    POTTY: 'potty',
    SOUNDS: 'sounds',
    ITEMS: 'items',
    CUSTOM: 'custom',

    title(category) {
        switch (category) {
            case this.SOCIAL: return 'Social';
            case this.OBEDIENCE: return 'Obedience';
            case this.POTTY: return 'Potty';
            case this.SOUNDS: return 'Sounds';
            case this.ITEMS: return 'Items';
            case this.CUSTOM: return 'Custom';
        }
    },

    types(category) {
        switch (category) {
            case this.SOCIAL: return [/* List of social training types */];
            case this.OBEDIENCE: return [/* List of obedience training types */];
            case this.POTTY: return [/* List of potty training types */];
            case this.SOUNDS: return [/* List of sounds training types */];
            case this.ITEMS: return [/* List of items training types */];
            case this.CUSTOM: return [];
        }
    },

    icon(category) {
        switch (category) {
            case this.SOCIAL: return 'Image(.socialTraining)';
            case this.OBEDIENCE: return 'Image(.obedienceTraining)';
            case this.POTTY: return 'Image(.pottyTraining)';
            case this.SOUNDS: return 'Image(.soundTraining)';
            case this.ITEMS: return 'Image(.itemsTraining)';
            case this.CUSTOM: return 'Image(.customTraining)';
        }
    },
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
  };

  
  // FoodUnits.js
  export const FoodUnits = {
    GRAM: 'gram',
    KG: 'kg',
    SERVING: 'serv',
    OZ: 'oz',
    LB: 'lb',
  };
  