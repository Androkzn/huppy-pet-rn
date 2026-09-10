/**
 * The diary's arithmetic.
 *
 * These figures drive what the owner feeds their dog, so the sums are pinned
 * down here: how a category's weight is totalled (including the meat/bones
 * split), how goals scale from day to week, and where the progress colour
 * turns from on-track to over.
 */

import {
  calculateGoalForCategory,
  calculatePercentage,
  calculateTotalConsumedCalories,
  calculateTotalDataForCategory,
  doesHaveMeatAndBones,
  getCaloriesGoal,
  progressBarColor,
} from '../Statistic';
import type { Activity, Food, FoodCategory, Profile } from '../../types';

const category = (type: string, percentage: number): FoodCategory =>
  ({
    _id: `cat-${type}`,
    type,
    index: 1,
    color: '#000',
    name: type,
    percentage,
    weight: 0,
    profileId: 'p1',
    userId: 'u1',
  }) as FoodCategory;

const food = (over: Partial<Food>): Food =>
  ({
    _id: 'f1',
    bonesRatio: 0,
    calories: 100,
    caloriesServing: 0,
    categoryType: 'meat',
    image: '',
    mealId: 'm1',
    meatRatio: 100,
    name: 'Food',
    servingWeight: 0,
    servings: 0,
    templateId: 't1',
    units: 'gram',
    weight: 100,
    type: 'food',
    userId: 'u1',
    date: new Date(),
    profileId: 'p1',
    ...over,
  }) as Food;

const profile = (over: Partial<Profile> = {}): Profile =>
  ({
    _id: 'p1',
    avatar: '',
    breed: '',
    categories: [],
    dailyPortion: 1000,
    dailyRatio: 5,
    dob: new Date(),
    isCurrent: true,
    isRatioSelected: true,
    name: 'Huppy',
    preset: 'barfAdult',
    size: 'medium',
    userId: 'u1',
    weight: 10,
    activityType: 'active',
    deductCalories: false,
    ...over,
  }) as Profile;

describe('doesHaveMeatAndBones', () => {
  it('is true only when both categories are present', () => {
    expect(
      doesHaveMeatAndBones([category('meat', 70), category('bones', 10)])
    ).toBe(true);
    expect(doesHaveMeatAndBones([category('meat', 70)])).toBe(false);
    expect(doesHaveMeatAndBones([])).toBe(false);
  });
});

describe('calculateTotalDataForCategory — weight', () => {
  it('totals plain weight when the diet has no meat/bones split', () => {
    const categories = [category('veggie', 10)];
    const items = [food({ categoryType: 'veggie', weight: 120 })];

    expect(
      calculateTotalDataForCategory('weight', 'veggie', items, categories)
    ).toBe(120);
  });

  it('splits a mixed cut across meat and bones by its ratios', () => {
    // A chicken neck is part meat, part bone; both categories draw from it.
    const categories = [category('meat', 70), category('bones', 10)];
    const items = [
      food({ categoryType: 'bones', weight: 100, meatRatio: 45, bonesRatio: 55 }),
    ];

    expect(
      calculateTotalDataForCategory('weight', 'bones', items, categories)
    ).toBe(55);
    expect(
      calculateTotalDataForCategory('weight', 'meat', items, categories)
    ).toBe(45);
  });

  it('measures servings by serving weight rather than grams', () => {
    const categories = [category('meat', 70)];
    const items = [
      food({ units: 'serving', servings: 3, servingWeight: 40, weight: 0 }),
    ];

    expect(
      calculateTotalDataForCategory('weight', 'meat', items, categories)
    ).toBe(120);
  });

  it('is zero when there is no food at all', () => {
    expect(calculateTotalDataForCategory('weight', 'meat', undefined, [])).toBe(0);
  });
});

describe('calculateTotalDataForCategory — calories', () => {
  it('scales per-100g energy by the weight eaten', () => {
    const categories = [category('meat', 70)];
    const items = [food({ calories: 165, weight: 220 })];

    // 165 kcal / 100 g × 220 g = 363
    expect(
      calculateTotalDataForCategory('calories', 'meat', items, categories)
    ).toBe(363);
  });

  it('uses per-serving energy for food measured in servings', () => {
    const categories = [category('meat', 70)];
    const items = [
      food({ units: 'serving', servings: 2, caloriesServing: 90, weight: 0 }),
    ];

    expect(
      calculateTotalDataForCategory('calories', 'meat', items, categories)
    ).toBe(180);
  });
});

describe('goals', () => {
  it('takes a category goal as its share of the daily portion', () => {
    // 70% of 1000 g
    expect(calculateGoalForCategory(category('meat', 70), profile(), true)).toBe(
      700
    );
  });

  it('multiplies the goal by seven for the weekly view', () => {
    expect(calculateGoalForCategory(category('meat', 70), profile(), false)).toBe(
      4900
    );
  });

  it('derives the calorie goal from weight and daily ratio', () => {
    // 18.59 × 10 kg × 5 = 929
    expect(getCaloriesGoal(profile(), true)).toBe(929);
    expect(getCaloriesGoal(profile(), false)).toBe(6506);
  });

  it('is zero without a profile', () => {
    expect(getCaloriesGoal(null, true)).toBe(0);
    expect(calculateGoalForCategory(undefined, null, true)).toBe(0);
  });
});

describe('calculatePercentage', () => {
  it('reports progress toward the goal', () => {
    expect(calculatePercentage(50, 200)).toBe(25);
    expect(calculatePercentage(250, 200)).toBe(125);
  });

  it('never divides by a zero goal', () => {
    expect(calculatePercentage(50, 0)).toBe(0);
  });

  it('floors negatives at zero rather than reporting backwards progress', () => {
    expect(calculatePercentage(-10, 100)).toBe(0);
  });
});

describe('calculateTotalConsumedCalories', () => {
  const categories = [category('meat', 70), category('veggie', 10)];
  const items = [
    food({ categoryType: 'meat', calories: 100, weight: 300 }),
    food({ _id: 'f2', categoryType: 'veggie', calories: 50, weight: 200 }),
  ];

  it('adds up every category the diet uses', () => {
    // 300 + 100
    expect(
      calculateTotalConsumedCalories(profile(), items, categories, [])
    ).toBe(400);
  });

  it('deducts burned calories when the profile asks for it', () => {
    const activities: Activity[] = [
      {
        _id: 'a1',
        type: 'walk',
        metric: 'distance',
        distance: 5,
        duration: 0,
        burnedCalories: 0,
        date: new Date(),
        profileId: 'p1',
        userId: 'u1',
      } as Activity,
    ];

    // 10 kg × 5 km × 0.8 = 40 burned
    expect(
      calculateTotalConsumedCalories(
        profile({ deductCalories: true }),
        items,
        categories,
        activities
      )
    ).toBe(360);
  });

  it('leaves the total alone when deduction is off', () => {
    const activities: Activity[] = [
      {
        _id: 'a1',
        type: 'walk',
        metric: 'duration',
        distance: 0,
        duration: 30,
        burnedCalories: 0,
        date: new Date(),
        profileId: 'p1',
        userId: 'u1',
      } as Activity,
    ];

    expect(
      calculateTotalConsumedCalories(profile(), items, categories, activities)
    ).toBe(400);
  });

  it('is zero without a profile', () => {
    expect(calculateTotalConsumedCalories(null, items, categories, [])).toBe(0);
  });
});

describe('progressBarColor', () => {
  it('changes at the goal and at each overshoot threshold', () => {
    const onTrack = progressBarColor(100);
    const near = progressBarColor(125);
    const over = progressBarColor(150);
    const far = progressBarColor(151);

    expect(progressBarColor(0)).toBe(onTrack);
    expect(new Set([onTrack, near, over, far]).size).toBe(4);
    expect(progressBarColor(101)).toBe(near);
    expect(progressBarColor(126)).toBe(over);
  });
});
