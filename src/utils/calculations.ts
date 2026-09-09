/**
 * Calculation utility functions for pet nutrition
 */

import type { Food, Profile, Activity, RatioPresets } from '../types';

/**
 * Calculate total calories from food items
 */
export const calculateTotalCalories = (foods: Food[]): number => {
  return foods.reduce((total, food) => total + food.calories, 0);
};

/**
 * Calculate total weight from food items
 */
export const calculateTotalWeight = (foods: Food[]): number => {
  return foods.reduce((total, food) => total + food.weight, 0);
};

/**
 * Calculate burned calories from activities
 */
export const calculateBurnedCalories = (activities: Activity[]): number => {
  return activities.reduce(
    (total, activity) => total + activity.burnedCalories,
    0
  );
};

/**
 * Calculate net calories (consumed - burned)
 */
export const calculateNetCalories = (
  consumedCalories: number,
  burnedCalories: number
): number => {
  return consumedCalories - burnedCalories;
};

/**
 * Calculate daily calorie goal based on weight and activity level
 * Using RER (Resting Energy Requirement) formula
 */
export const calculateDailyCalorieGoal = (
  weightKg: number,
  activityLevel: string
): number => {
  // RER = 70 × (body weight in kg)^0.75
  const rer = 70 * Math.pow(weightKg, 0.75);

  // Multiply by activity factor
  const activityFactors: { [key: string]: number } = {
    sedentary: 1.2,
    light: 1.4,
    moderate: 1.6,
    active: 1.8,
    very_active: 2.0,
  };

  const factor = activityFactors[activityLevel] || 1.6;
  return Math.round(rer * factor);
};

/**
 * Calculate percentage of daily goal
 */
export const calculatePercentageOfGoal = (
  current: number,
  goal: number
): number => {
  if (goal === 0) return 0;
  return Math.round((current / goal) * 100);
};

/**
 * Calculate food category percentages
 */
export const calculateCategoryPercentages = (
  foods: Food[],
  totalWeight: number
): { [categoryType: string]: number } => {
  const categoryWeights: { [categoryType: string]: number } = {};

  foods.forEach((food) => {
    if (!categoryWeights[food.categoryType]) {
      categoryWeights[food.categoryType] = 0;
    }
    categoryWeights[food.categoryType] += food.weight;
  });

  const percentages: { [categoryType: string]: number } = {};
  Object.keys(categoryWeights).forEach((category) => {
    percentages[category] = totalWeight > 0
      ? Math.round((categoryWeights[category] / totalWeight) * 100)
      : 0;
  });

  return percentages;
};

/**
 * Calculate macronutrient breakdown
 */
export const calculateMacros = (
  foods: Food[]
): { protein: number; fat: number; carbs: number } => {
  // This would need to be enhanced based on your food template structure
  // For now, returning a placeholder
  return {
    protein: 0,
    fat: 0,
    carbs: 0,
  };
};

/**
 * Convert pounds to kilograms
 */
export const poundsToKg = (pounds: number): number => {
  return pounds * 0.453592;
};

/**
 * Convert kilograms to pounds
 */
export const kgToPounds = (kg: number): number => {
  return kg * 2.20462;
};

/**
 * Calculate serving weight based on servings
 */
export const calculateServingWeight = (
  servingWeight: number,
  servings: number
): number => {
  return servingWeight * servings;
};

/**
 * Calculate calories from serving
 */
export const calculateCaloriesFromServing = (
  caloriesPerServing: number,
  servings: number
): number => {
  return caloriesPerServing * servings;
};
