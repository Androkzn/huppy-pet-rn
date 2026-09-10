/**
 * Application Constants
 */

// Estimated calories per 1kg dog weight
export const EST_CALORIES_PER_KG = 18.59;

// Diet Ratio Presets
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

// Food Category Colors
export const CATEGORY_COLORS = {
  meat: '#E74C3C',
  organ: '#8E44AD',
  bone: '#ECF0F1',
  vegetable: '#27AE60',
  fruit: '#F39C12',
  fish: '#3498DB',
  dairy: '#F8F9FA',
  supplement: '#95A5A6',
  other: '#BDC3C7',
} as const;

// Activity Types
export const ACTIVITY_TYPES = [
  { label: 'Walk', value: 'walk' },
  { label: 'Run', value: 'run' },
  { label: 'Swim', value: 'swim' },
  { label: 'Play', value: 'play' },
  { label: 'Hike', value: 'hike' },
  { label: 'Training', value: 'training' },
  { label: 'Other', value: 'other' },
] as const;

// Training Categories
export const TRAINING_CATEGORIES = [
  { label: 'Obedience', value: 'obedience' },
  { label: 'Tricks', value: 'tricks' },
  { label: 'Agility', value: 'agility' },
  { label: 'Socialization', value: 'socialization' },
  { label: 'Behavior', value: 'behavior' },
  { label: 'Custom', value: 'custom' },
] as const;

// Dog Sizes
export const DOG_SIZES = [
  { label: 'Small (0-25 lbs)', value: 'small' },
  { label: 'Medium (26-50 lbs)', value: 'medium' },
  { label: 'Large (51-100 lbs)', value: 'large' },
  { label: 'Giant (100+ lbs)', value: 'giant' },
] as const;

// Activity Levels
export const ACTIVITY_LEVELS = [
  { label: 'Sedentary', value: 'sedentary', description: 'Little to no exercise' },
  { label: 'Light', value: 'light', description: 'Light exercise 1-2 times/week' },
  { label: 'Moderate', value: 'moderate', description: 'Moderate exercise 3-5 times/week' },
  { label: 'Active', value: 'active', description: 'Heavy exercise 6-7 times/week' },
  { label: 'Very Active', value: 'very_active', description: 'Very heavy daily exercise' },
] as const;

// Measurement Units
export const WEIGHT_UNITS = [
  { label: 'Grams (g)', value: 'g' },
  { label: 'Kilograms (kg)', value: 'kg' },
  { label: 'Ounces (oz)', value: 'oz' },
  { label: 'Pounds (lbs)', value: 'lbs' },
] as const;

// Distance Units
export const DISTANCE_UNITS = [
  { label: 'Meters (m)', value: 'm' },
  { label: 'Kilometers (km)', value: 'km' },
  { label: 'Miles (mi)', value: 'mi' },
] as const;

// Time Format
export const TIME_FORMAT = 'hh:mm A';
export const DATE_FORMAT = 'MM/DD/YYYY';
export const DATETIME_FORMAT = 'MM/DD/YYYY hh:mm A';

// Query Keys (for React Query)
export const QUERY_KEYS = {
  // Food
  SEARCH_FOOD: 'searchFood',
  FOOD_FOR_MEAL: 'getAllFoodForMeal',
  FOOD_FOR_DATE: 'loadFoodForDate',
  FOOD_FOR_PERIOD: 'getFoodForPeriod',
  CUSTOM_FOOD_TEMPLATES: 'customFoodTemplates',
  FOOD_TEMPLATES_FOR_CATEGORY: 'foodTemplatesForCategory',
  FOOD_CATEGORIES: 'foodCategories',

  // Meals
  MEALS_FOR_DATE: 'loadMealsForDate',

  // Activities
  ACTIVITIES_FOR_DATE: 'loadActivitiesForDate',
  ACTIVITIES_FOR_PERIOD: 'getActivitiesForPeriod',

  // Trainings
  TRAININGS_FOR_DATE: 'loadTrainingsForDate',
  TRAININGS_FOR_PERIOD: 'getTrainingsForPeriod',

  // Profiles
  PROFILES: 'getProfiles',
  CURRENT_PROFILE: 'getCurrentProfile',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  AUTH_FAILED: 'Authentication failed. Please login again.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, and numbers.',
  PASSWORDS_DONT_MATCH: 'Passwords do not match.',
  REQUIRED_FIELD: 'This field is required.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  PROFILE_CREATED: 'Profile created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  MEAL_ADDED: 'Meal added successfully!',
  FOOD_ADDED: 'Food added successfully!',
  ACTIVITY_ADDED: 'Activity added successfully!',
  TRAINING_ADDED: 'Training added successfully!',
  PASSWORD_RESET_SENT: 'Password reset email sent!',
} as const;
