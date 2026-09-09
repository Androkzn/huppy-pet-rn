/**
 * Statistic — port of the web app's Statistic.components.js.
 *
 * The progress rows on the Diary screen: one calories row and one row per food
 * category, plus the Today / This Week toggle and the diet-balance legend row.
 * The arithmetic is carried over unchanged so the numbers match the web.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import * as colors from '../theme/colors';
import { fontFamily } from '../theme';
import { Asset } from './ui/Asset';
import type { Food, Profile, Activity, FoodCategory } from '../types';

// Constants.helper.js: estimated calories per 1kg of dog weight.
const EST_CALORIES = 18.59;

const FOOD_CATEGORY_OTHER = 'other';

export function doesHaveMeatAndBones(categories: FoodCategory[]): boolean {
  return (
    categories.filter((c) => c.type === 'bones').length > 0 &&
    categories.filter((c) => c.type === 'meat').length > 0
  );
}

export function calculateTotalDataForCategory(
  dataType: 'weight' | 'calories' | 'nutrients',
  foodType: string,
  foodData: Food[] | undefined,
  categories: FoodCategory[]
): number {
  if (!foodData) return 0;

  const total = foodData
    .filter((food) => {
      if (
        (doesHaveMeatAndBones(categories) &&
          foodType === 'bones' &&
          dataType === 'weight' &&
          (food.categoryType === 'bones' || food.categoryType === 'meat')) ||
        (doesHaveMeatAndBones(categories) &&
          foodType === 'meat' &&
          dataType === 'weight' &&
          (food.categoryType === 'bones' || food.categoryType === 'meat'))
      ) {
        return foodType === 'bones' || foodType === 'meat';
      }
      return food.categoryType === foodType;
    })
    .reduce((sum, food) => {
      switch (dataType) {
        case 'weight':
          if (doesHaveMeatAndBones(categories) && foodType === 'bones') {
            return (
              sum +
              (food.units === 'serving'
                ? food.servings * food.servingWeight * (food.bonesRatio / 100)
                : food.weight * (food.bonesRatio / 100))
            );
          } else if (doesHaveMeatAndBones(categories) && foodType === 'meat') {
            return (
              sum +
              (food.units === 'serving'
                ? food.servings * food.servingWeight * (food.meatRatio / 100)
                : food.weight * (food.meatRatio / 100))
            );
          }
          return (
            sum +
            (food.units === 'serving'
              ? food.servings * food.servingWeight
              : food.weight)
          );
        case 'calories':
          return (
            sum +
            (food.units === 'serving'
              ? food.servings * food.caloriesServing
              : (food.weight / 100) * food.calories)
          );
        case 'nutrients':
          return sum + food.weight;
        default:
          return sum;
      }
    }, 0);

  return Math.floor(total);
}

export function calculateGoalForCategory(
  category: FoodCategory | undefined,
  currentProfile: Profile | null | undefined,
  isToday: boolean
): number {
  const weight = Math.floor(
    ((currentProfile?.dailyPortion ?? 0) * (category?.percentage ?? 0)) / 100
  );
  return isToday ? weight : weight * 7;
}

export function calculatePercentage(value: number, goal: number): number {
  if (goal === 0) return 0;
  return Math.floor(Math.max((value / goal) * 100, 0));
}

function getCaloriesBurnedFor(
  metricType: string,
  value: number,
  currentProfile: Profile
): number {
  if (metricType === 'distance') {
    // Weight (lb) × miles × 0.8, as on the web.
    return currentProfile.weight * value * 0.8;
  }
  // Other metrics (duration) burn a flat 2 calories per minute.
  return value * 2;
}

function getTotalCaloriesBurnedFor(
  currentProfile: Profile | null | undefined,
  activities: Activity[] | undefined
): number {
  if (currentProfile?.deductCalories && activities) {
    const total = activities.reduce((result, activity) => {
      const value =
        activity.metric === 'distance' ? activity.distance : activity.duration;
      return result + getCaloriesBurnedFor(activity.metric, value, currentProfile);
    }, 0);
    return Math.floor(total);
  }
  return 0;
}

export function calculateTotalConsumedCalories(
  currentProfile: Profile | null | undefined,
  food: Food[] | undefined,
  categories: FoodCategory[],
  activities: Activity[] | undefined
): number {
  if (!currentProfile) return 0;

  let totalCalories = 0;
  for (const category of categories) {
    totalCalories += calculateTotalDataForCategory(
      'calories',
      category.type,
      food,
      categories
    );
  }

  if (currentProfile.deductCalories && totalCalories > 0) {
    totalCalories -= getTotalCaloriesBurnedFor(currentProfile, activities);
  }

  return Math.floor(totalCalories);
}

export function getCaloriesGoal(
  currentProfile: Profile | null | undefined,
  isToday: boolean
): number {
  if (!currentProfile) return 0;
  const multiplier = isToday ? 1 : 7;
  return Math.floor(
    EST_CALORIES * currentProfile.weight * currentProfile.dailyRatio * multiplier
  );
}

/** Green under goal, then yellow, orange and red as it is exceeded. */
export function progressBarColor(value: number): string {
  if (value <= 100) return colors.green;
  if (value <= 125) return colors.yellow;
  if (value <= 150) return colors.orange;
  return colors.red;
}

interface ProgressBarProps {
  percentage: number;
  style?: object;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, style }) => {
  const fillWidth =
    percentage < 5 && percentage > 0 ? 5 : percentage <= 100 ? percentage : 100;

  return (
    <View style={[styles.progressContainer, style]}>
      <View
        style={[
          styles.progressFiller,
          {
            width: `${fillWidth}%`,
            backgroundColor: progressBarColor(percentage),
            // The web squares off the right edge until the bar is nearly full.
            borderTopRightRadius: percentage < 95 ? 0 : 10,
            borderBottomRightRadius: percentage < 95 ? 0 : 10,
          },
        ]}
      >
        <Text
          style={[
            styles.progressLabel,
            {
              color: percentage <= 20 ? colors.black : colors.white,
              marginLeft: percentage <= 20 ? percentage + 10 : 0,
            },
          ]}
        >
          {`${percentage}%`}
        </Text>
      </View>
    </View>
  );
};

interface CaloriesSectionProps {
  foodData?: Food[];
  categories: FoodCategory[];
  activities?: Activity[];
  currentProfile: Profile | null;
  isStatisticToday: boolean;
}

export const CaloriesStatisticSection: React.FC<CaloriesSectionProps> = ({
  foodData,
  categories,
  activities,
  currentProfile,
  isStatisticToday,
}) => {
  const calories = calculateTotalConsumedCalories(
    currentProfile,
    foodData,
    categories,
    activities
  );
  const totalCalories = getCaloriesGoal(currentProfile, isStatisticToday);
  const percentage = calculatePercentage(calories, totalCalories);

  return (
    <View style={styles.caloriesSection}>
      <View style={styles.caloriesImage}>
        <Asset imageName="calories.png" width={40} height={40} />
      </View>
      <ProgressBar percentage={percentage} />
      <Text style={[styles.values, { color: progressBarColor(percentage) }]}>
        {calories} / {totalCalories} kcal
      </Text>
    </View>
  );
};

interface CategorySectionProps {
  category: FoodCategory;
  categories: FoodCategory[];
  currentProfile: Profile | null;
  foodData?: Food[];
  isStatisticToday: boolean;
}

export const CategoriesStatisticSection: React.FC<CategorySectionProps> = ({
  category,
  categories,
  currentProfile,
  foodData,
  isStatisticToday,
}) => {
  const weight = calculateTotalDataForCategory(
    'weight',
    category.type,
    foodData,
    categories
  );
  const total = calculateGoalForCategory(
    category,
    currentProfile,
    isStatisticToday
  );
  const percentage = calculatePercentage(weight, total);
  const caloriesOther = calculateTotalDataForCategory(
    'calories',
    'other',
    foodData,
    categories
  );

  // 'Other' has no weight goal, so the web hides its bar and shows calories.
  const isOther = category.type === FOOD_CATEGORY_OTHER;

  return (
    <View style={styles.categorySection}>
      <Asset
        imageName={`${category.type.toLowerCase()}.png`}
        width={30}
        height={30}
      />
      <Text style={styles.categoryName}>{category.name}</Text>
      <ProgressBar
        percentage={isOther ? 0 : percentage}
        style={isOther ? { opacity: 0 } : undefined}
      />
      <Text
        style={[
          styles.values,
          { color: progressBarColor(isOther ? 0 : percentage) },
        ]}
      >
        {isOther ? `${weight} g / ${caloriesOther} kcal` : `${weight} / ${total} g`}
      </Text>
    </View>
  );
};

interface ToggleProps {
  initialValue: boolean;
  onChange: () => void;
}

export const ToggleStatisticSection: React.FC<ToggleProps> = ({
  initialValue,
  onChange,
}) => {
  const [checked, setChecked] = useState(initialValue);

  return (
    <View style={styles.toggleSection}>
      <Text style={styles.toggleLabel}>Today</Text>
      <Switch
        value={checked}
        onValueChange={(value) => {
          setChecked(value);
          onChange();
        }}
        trackColor={{ false: colors.olive, true: colors.orange }}
        thumbColor={colors.white}
      />
      <Text style={styles.toggleLabel}>This Week</Text>
    </View>
  );
};

interface FoodCategoryRowProps {
  name: string;
  value: number;
  color: string;
  weight: number;
}

/** The diet-balance legend row beside the pie chart. */
export const FoodCategoryRow: React.FC<FoodCategoryRowProps> = ({
  name,
  value,
  color,
  weight,
}) => (
  <View style={styles.legendRow}>
    <Text style={[styles.legendName, { backgroundColor: color }]}>{name}</Text>
    <Text style={styles.legendWeight}>{weight} g</Text>
    <Text style={styles.legendValue}>{value}%</Text>
  </View>
);

const styles = StyleSheet.create({
  progressContainer: {
    flex: 1,
    height: 20,
    backgroundColor: '#e0e0de',
    borderRadius: 10,
    marginRight: 5,
    maxWidth: 350,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  progressFiller: {
    height: '100%',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  progressLabel: {
    padding: 5,
    fontSize: 14,
    fontFamily: fontFamily.bold,
  },
  caloriesSection: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 45,
    marginVertical: 5,
  },
  caloriesImage: {
    marginRight: 15,
  },
  categorySection: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 35,
  },
  categoryName: {
    textAlign: 'left',
    minWidth: 50,
    fontFamily: fontFamily.bold,
    fontSize: 13,
    color: colors.green,
    paddingLeft: 5,
  },
  values: {
    minWidth: 110,
    textAlign: 'center',
    fontFamily: fontFamily.bold,
    fontSize: 13,
  },
  toggleSection: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleLabel: {
    margin: 5,
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: colors.green,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    height: 30,
    marginRight: 10,
    width: '100%',
  },
  legendName: {
    fontSize: 16,
    fontFamily: fontFamily.bold,
    minWidth: 100,
    borderRadius: 5,
    padding: 3,
    color: colors.white,
    textAlign: 'center',
    overflow: 'hidden',
  },
  legendWeight: {
    padding: 5,
    minWidth: 70,
    textAlign: 'center',
    fontFamily: fontFamily.regular,
    fontSize: 16,
  },
  legendValue: {
    padding: 5,
    minWidth: 40,
    textAlign: 'center',
    fontFamily: fontFamily.regular,
    fontSize: 16,
  },
});
