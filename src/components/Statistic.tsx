/**
 * Statistic — the progress rows on the Diary screen.
 *
 * One calories row, one row per food category, the Today / This week picker and
 * the diet-balance legend. The arithmetic is the web app's, unchanged, so the
 * numbers still match; the presentation is the iOS one — a name, the figure it
 * has reached, and a capsule progress track that fills toward the goal.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppTheme } from '@theme/ThemeProvider';
import { layout, radius, spacing } from '@theme/tokens';
import { Label } from './ios/Text';
import { ProgressBar as IOSProgressBar } from './ios/Feedback';
import { SegmentedControl } from './ios/SegmentedControl';
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


/**
 * Progress colours: on track, then warning as the goal is passed.
 * These are fixed rather than semantic, since the scale itself carries meaning
 * and has to read the same in both appearances.
 */
const PROGRESS_COLORS = {
  onTrack: '#34A853',
  near: '#E8B02A',
  over: '#E27B2E',
  far: '#D6402C',
} as const;

/** Green under goal, then yellow, orange and red as it is exceeded. */
export function progressBarColor(value: number): string {
  if (value <= 100) return PROGRESS_COLORS.onTrack;
  if (value <= 125) return PROGRESS_COLORS.near;
  if (value <= 150) return PROGRESS_COLORS.over;
  return PROGRESS_COLORS.far;
}

interface ProgressBarProps {
  percentage: number;
  style?: object;
}

/** A capsule track that fills toward the goal, coloured by how close it is. */
export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, style }) => (
  <IOSProgressBar
    value={percentage / 100}
    color={progressBarColor(percentage)}
    height={6}
    style={style}
  />
);

interface StatRowProps {
  name: string;
  /** Left-hand artwork: the category or calories icon. */
  imageName?: string;
  value: string;
  percentage: number;
  /** Rows without a goal (the 'other' category) state a figure only. */
  showProgress?: boolean;
  prominent?: boolean;
}

/**
 * One statistic: what it is, where it stands, and how far along that is.
 * The figure sits on the same line as the name, as iOS does in Health.
 */
const StatRow: React.FC<StatRowProps> = ({
  name,
  imageName,
  value,
  percentage,
  showProgress = true,
  prominent = false,
}) => (
  <View style={styles.statRow}>
    <View style={styles.statHeader}>
      {imageName ? (
        <Asset imageName={imageName} width={prominent ? 26 : 22} height={prominent ? 26 : 22} />
      ) : null}
      <Label variant={prominent ? 'headline' : 'subheadline'} numberOfLines={1} style={styles.statName}>
        {name}
      </Label>
      <Label
        variant={prominent ? 'headline' : 'subheadline'}
        weight="600"
        color={showProgress ? progressBarColor(percentage) : undefined}
        role={showProgress ? undefined : 'secondary'}
        numberOfLines={1}
      >
        {value}
      </Label>
    </View>
    {showProgress ? <ProgressBar percentage={percentage} /> : null}
  </View>
);

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
    <StatRow
      name="Calories"
      imageName="calories.png"
      value={`${calories} / ${totalCalories} kcal`}
      percentage={percentage}
      prominent
    />
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
  const total = calculateGoalForCategory(category, currentProfile, isStatisticToday);
  const percentage = calculatePercentage(weight, total);
  const caloriesOther = calculateTotalDataForCategory(
    'calories',
    'other',
    foodData,
    categories
  );

  // 'Other' has no weight goal, so it states its figures without a bar.
  const isOther = category.type === FOOD_CATEGORY_OTHER;

  return (
    <StatRow
      name={category.name}
      imageName={`${category.type.toLowerCase()}.png`}
      value={isOther ? `${weight} g · ${caloriesOther} kcal` : `${weight} / ${total} g`}
      percentage={isOther ? 0 : percentage}
      showProgress={!isOther}
    />
  );
};

interface ToggleProps {
  initialValue: boolean;
  onChange: () => void;
}

/** Today / This week — a segmented control, the iOS way to switch a range. */
export const ToggleStatisticSection: React.FC<ToggleProps> = ({
  initialValue,
  onChange,
}) => (
  <SegmentedControl
    segments={[
      { label: 'Today', value: 'today' },
      { label: 'This week', value: 'week' },
    ]}
    value={initialValue ? 'week' : 'today'}
    onChange={onChange}
    size="sm"
    style={styles.rangePicker}
  />
);

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
}) => {
  const { colors } = useAppTheme();

  return (
    <View style={styles.legendRow}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Label variant="subheadline" numberOfLines={1} style={styles.legendName}>
        {name}
      </Label>
      <Label variant="subheadline" role="secondary">
        {weight} g
      </Label>
      <Label
        variant="subheadline"
        weight="600"
        color={colors.label}
        style={styles.legendValue}
      >
        {value}%
      </Label>
    </View>
  );
};

const styles = StyleSheet.create({
  statRow: {
    gap: 6,
    paddingVertical: spacing.md,
    paddingHorizontal: layout.screenPadding,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statName: {
    flex: 1,
  },
  rangePicker: {
    marginHorizontal: layout.screenPadding,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 9,
    paddingHorizontal: layout.screenPadding,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: radius.capsule,
  },
  legendName: {
    flex: 1,
  },
  legendValue: {
    minWidth: 44,
    textAlign: 'right',
  },
});
