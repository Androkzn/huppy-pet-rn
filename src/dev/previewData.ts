/**
 * TEMPORARY preview fixtures — used to screenshot the ported screens while the
 * app's MongoDB Realm backend is offline. Delete along with src/dev.
 */

import { QueryClient } from '@tanstack/react-query';
import { getCategoriesForRatioPreset } from '@constants/enums';

export const PREVIEW_USER_ID = 'preview-user';

/** Fixed so the seeded query keys match the ones the screens ask for. */
export const PREVIEW_DATE = new Date();

export const previewProfile: any = {
  _id: 'preview-profile',
  avatar: '',
  breed: 'Nova Scotia Duck Tolling Retriever',
  categories: [],
  dailyPortion: 500,
  dailyRatio: 5,
  dob: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000),
  isCurrent: true,
  isRatioSelected: true,
  name: 'Huppy',
  preset: 'barfAdult',
  size: 'medium',
  userId: PREVIEW_USER_ID,
  weight: 10,
  activityType: 'active',
  deductCalories: true,
};

const previewCategories = getCategoriesForRatioPreset(
  previewProfile.dailyPortion,
  previewProfile._id,
  previewProfile.preset
).map((category, index) => ({ ...category, _id: `cat-${index}` }));

const previewMeal: any = {
  _id: 'preview-meal',
  date: new Date(),
  profileId: previewProfile._id,
  userId: PREVIEW_USER_ID,
};

const previewFood: any[] = [
  {
    _id: 'food-1',
    name: 'Chicken breast',
    calories: 165,
    caloriesServing: 0,
    categoryType: 'meat',
    weight: 220,
    servings: 0,
    servingWeight: 0,
    units: 'gram',
    meatRatio: 100,
    bonesRatio: 0,
    image: '',
    mealId: previewMeal._id,
    templateId: 't1',
    type: 'food',
    userId: PREVIEW_USER_ID,
    profileId: previewProfile._id,
    date: new Date(),
  },
  {
    _id: 'food-2',
    name: 'Beef liver',
    calories: 135,
    caloriesServing: 0,
    categoryType: 'liver',
    weight: 25,
    servings: 0,
    servingWeight: 0,
    units: 'gram',
    meatRatio: 0,
    bonesRatio: 0,
    image: '',
    mealId: previewMeal._id,
    templateId: 't2',
    type: 'food',
    userId: PREVIEW_USER_ID,
    profileId: previewProfile._id,
    date: new Date(),
  },
  {
    _id: 'food-3',
    name: 'Chicken necks',
    calories: 180,
    caloriesServing: 0,
    categoryType: 'bones',
    weight: 60,
    servings: 0,
    servingWeight: 0,
    units: 'gram',
    meatRatio: 45,
    bonesRatio: 55,
    image: '',
    mealId: previewMeal._id,
    templateId: 't3',
    type: 'food',
    userId: PREVIEW_USER_ID,
    profileId: previewProfile._id,
    date: new Date(),
  },
];

const previewActivities: any[] = [
  {
    _id: 'act-1',
    type: 'walk',
    metric: 'distance',
    distance: 3,
    duration: 0,
    burnedCalories: 24,
    date: new Date(),
    profileId: previewProfile._id,
    userId: PREVIEW_USER_ID,
  },
];

const previewTrainings: any[] = [
  {
    _id: 'tr-1',
    date: new Date(),
    category: 'obedience',
    customCategory: '',
    customType: '',
    desc: '',
    isCompleted: true,
    type: 'sit',
    profileId: previewProfile._id,
    userId: PREVIEW_USER_ID,
  },
  {
    _id: 'tr-2',
    date: new Date(),
    category: 'social',
    customCategory: '',
    customType: '',
    desc: '',
    isCompleted: false,
    type: 'dogs',
    profileId: previewProfile._id,
    userId: PREVIEW_USER_ID,
  },
];

/** Seeds every query the ported screens read. */
export const seedPreviewData = (queryClient: QueryClient, date: Date) => {
  queryClient.setQueryData(['getCurrentProfile', PREVIEW_USER_ID], previewProfile);
  queryClient.setQueryData(['getProfiles', PREVIEW_USER_ID], [previewProfile]);
  queryClient.setQueryData(['foodCategories', previewProfile._id], previewCategories);
  queryClient.setQueryData(['loadMealsForDate', date], [previewMeal]);
  queryClient.setQueryData(['loadFoodForDate', date], previewFood);
  queryClient.setQueryData(['getAllFoodForMeal', previewMeal._id], previewFood);
  queryClient.setQueryData(['loadActivitiesForDate', date], previewActivities);
  queryClient.setQueryData(['loadTrainingsForDate', date], previewTrainings);
};
