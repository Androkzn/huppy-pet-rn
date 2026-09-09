/**
 * TypeScript type definitions for the application
 */

// User & Authentication
export interface User {
  id: string;
  _accessToken: string | null;
  refreshAccessToken: () => Promise<void>;
}

// Profile
export interface Profile {
  _id: string;
  avatar: string;
  breed: string;
  categories: FoodCategory[];
  dailyPortion: number;
  dailyRatio: number;
  dob: Date;
  isCurrent: boolean;
  isRatioSelected: boolean;
  name: string;
  preset: string;
  size: string;
  userId: string;
  weight: number;
  activityType: string;
  deductCalories: boolean;
  key?: string;
}

// Food
export interface Food {
  _id: string;
  bonesRatio: number;
  calories: number;
  caloriesServing: number;
  categoryType: string;
  image: string;
  mealId: string;
  meatRatio: number;
  name: string;
  servingWeight: number;
  servings: number;
  templateId: string;
  units: string;
  weight: number;
  type: string;
  userId: string;
  date: Date;
  profileId: string;
  key?: string;
}

// Food Template
export interface FoodTemplate {
  _id: string;
  ash: number;
  bonesRatio: number;
  calories: number;
  caloriesServing: number;
  carb: number;
  categoryType: string;
  desc: string;
  fat: number;
  fiber: number;
  image: string;
  isCustom: boolean;
  meatRatio: number;
  name: string;
  protein: number;
  servingWeight: number;
  servings: number;
  type: string;
  units: string;
  userId: string;
  weight: number;
}

// Food Category
export interface FoodCategory {
  _id: string;
  type: string;
  index: number;
  color: string;
  name: string;
  percentage: number;
  weight: number;
  profileId: string;
  userId: string;
}

// Meal
export interface Meal {
  _id: string;
  date: Date;
  profileId: string;
  userId: string;
  key?: string;
}

// Activity
export interface Activity {
  _id: string;
  date: Date;
  burnedCalories: number;
  distance: number;
  duration: number;
  metric: string;
  type: string;
  profileId: string;
  userId: string;
  key?: string;
}

// Training
export interface Training {
  _id: string;
  date: Date;
  category: string;
  customCategory: string;
  customType: string;
  desc: string;
  isCompleted: boolean;
  type: string;
  profileId: string;
  userId: string;
  key?: string;
}

// Enums and Constants
export enum FoodCategoryType {
  MEAT = 'meat',
  ORGAN = 'organ',
  BONE = 'bone',
  VEGETABLE = 'vegetable',
  FRUIT = 'fruit',
  FISH = 'fish',
  DAIRY = 'dairy',
  SUPPLEMENT = 'supplement',
  OTHER = 'other',
}

export enum RatioPresets {
  CUSTOM = 'custom',
  BARF = 'barf',
  PMR = 'pmr',
  WHOLE_PREY = 'whole_prey',
}

export enum FilterFood {
  ALL = 'all',
  CATEGORY = 'category',
  CUSTOM = 'custom',
  RECIPE = 'recipe',
}

export enum ActivityType {
  SEDENTARY = 'sedentary',
  LIGHT = 'light',
  MODERATE = 'moderate',
  ACTIVE = 'active',
  VERY_ACTIVE = 'very_active',
}

export enum DogSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  GIANT = 'giant',
}
