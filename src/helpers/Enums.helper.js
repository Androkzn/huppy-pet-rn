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
  };
  
  // Helper function to switch key to value
  const mapAddFoodRowType = (key) => {
    switch (key) {
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
        return key;
    }
  };
  
  export { mapAddFoodRowType };
  
  // FoodUnits.js
  export const FoodUnits = {
    GRAM: 'gram',
    KG: 'kg',
    SERVING: 'serv',
    OZ: 'oz',
    LB: 'lb',
  };
  