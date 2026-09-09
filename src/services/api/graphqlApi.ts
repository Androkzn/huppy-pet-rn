/**
 * GraphQL API Service
 * Wraps GraphQL queries and mutations with proper typing
 */

import { executeQuery, executeMutation } from '@services/graphql/graphqlClient';
import * as queries from '@services/graphql/queries';
import * as mutations from '@services/graphql/mutations';
import type {
  Food,
  FoodTemplate,
  FoodCategory,
  Meal,
  Activity,
  Training,
  Profile,
} from '../../types';
import { getStartOfDay, getEndOfDay } from '@utils/date';

// FOOD API

export const searchForFood = async (
  searchQuery: string
): Promise<FoodTemplate[]> => {
  const response = await executeQuery<{ search: FoodTemplate[] }>(
    queries.SEARCH_FOOD_TEMPLATE,
    { searchQuery }
  );
  return response.search || [];
};

export const getAllFoodForMeal = async (
  mealId: string,
  profileId: string
): Promise<Food[]> => {
  const response = await executeQuery<{ foods: Food[] }>(
    queries.GET_ALL_FOOD_FOR_MEAL,
    { mealId, profileId }
  );
  return response.foods || [];
};

export const getFoodForPeriod = async (
  userId: string,
  profileId: string,
  startTime: Date,
  endTime: Date
): Promise<Food[]> => {
  const startDate = getStartOfDay(startTime);
  const endDate = getEndOfDay(endTime);

  const response = await executeQuery<{ foods: Food[] }>(
    queries.GET_FOOD_FOR_PERIOD,
    { userId, profileId, startDate, endDate }
  );
  return response.foods || [];
};

export const loadFood = async (
  userId: string,
  profileId: string,
  startTime: Date,
  endTime: Date
): Promise<Food[]> => {
  const startDate = getStartOfDay(startTime);
  const endDate = getEndOfDay(endTime);

  const response = await executeQuery<{ foods: Food[] }>(queries.GET_ALL_FOOD, {
    userId,
    profileId,
    startDate,
    endDate,
  });
  return response.foods || [];
};

export const getAllCustomFoodTemplates = async (): Promise<FoodTemplate[]> => {
  const response = await executeQuery<{ foodTemplates: FoodTemplate[] }>(
    queries.GET_ALL_CUSTOM_FOOD_TEMPLATES
  );
  return response.foodTemplates || [];
};

export const getAllFoodTemplatesForCategory = async (
  categoryType: string
): Promise<FoodTemplate[]> => {
  const response = await executeQuery<{ foodTemplates: FoodTemplate[] }>(
    queries.GET_ALL_FOOD_TEMPLATES_FOR_CATEGORY,
    { categoryType: categoryType.toLowerCase() }
  );
  return response.foodTemplates || [];
};

export const getAllFoodCategories = async (
  profileId: string
): Promise<FoodCategory[]> => {
  const response = await executeQuery<{ foodCategories: FoodCategory[] }>(
    queries.GET_ALL_FOOD_CATEGORIES,
    { profileId }
  );
  return response.foodCategories || [];
};

export const getFoodTemplateById = async (
  id: string
): Promise<FoodTemplate | null> => {
  const response = await executeQuery<{ foodTemplate: FoodTemplate }>(
    queries.GET_FOOD_TEMPLATE_BY_ID,
    { id }
  );
  return response.foodTemplate || null;
};

export const getFoodById = async (id: string): Promise<Food | null> => {
  const response = await executeQuery<{ food: Food }>(
    queries.GET_FOOD_BY_ID,
    { id }
  );
  return response.food || null;
};

export const addFood = async (data: {
  bonesRatio: number;
  categoryType: string;
  calories: number;
  caloriesServing: number;
  image: string;
  mealId: string;
  meatRatio: number;
  name: string;
  servingWeight: number;
  servings: number;
  templateId: string;
  type: string;
  units: string;
  weight: number;
  userId: string;
  profileId: string;
  date: Date;
}): Promise<{ _id: string }> => {
  const response = await executeMutation<{
    insertOneFood: { _id: string };
  }>(mutations.ADD_FOOD, { data });
  return response.insertOneFood;
};

export const updateFood = async (
  foodId: string,
  updateData: Partial<Food>
): Promise<boolean> => {
  await executeMutation(mutations.UPDATE_FOOD, { foodId, updateData });
  return true;
};

export const deleteFood = async (_id: string): Promise<boolean> => {
  await executeMutation(mutations.DELETE_FOOD, { query: { _id } });
  return true;
};

// FOOD TEMPLATE API

export const addFoodTemplate = async (
  data: Partial<FoodTemplate>
): Promise<{ success: boolean; templateId: string }> => {
  const response = await executeMutation<{
    insertOneFoodTemplate: { _id: string };
  }>(mutations.ADD_FOOD_TEMPLATE, { data });
  return {
    success: true,
    templateId: response.insertOneFoodTemplate._id,
  };
};

export const updateFoodTemplate = async (
  templateId: string,
  updateData: Partial<FoodTemplate>
): Promise<boolean> => {
  await executeMutation(mutations.UPDATE_FOOD_TEMPLATE, {
    templateId,
    updateData,
  });
  return true;
};

export const deleteFoodTemplate = async (_id: string): Promise<boolean> => {
  await executeMutation(mutations.DELETE_FOOD_TEMPLATE, { query: { _id } });
  return true;
};

// MEAL API

export const loadMeals = async (
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<Meal[]> => {
  const response = await executeQuery<{ meals: Meal[] }>(
    queries.GET_ALL_MEALS,
    { userId, startDate, endDate }
  );
  return response.meals || [];
};

export const addMeal = async (data: {
  date: Date;
  profileId: string;
  userId: string;
}): Promise<string> => {
  const response = await executeMutation<{ insertOneMeal: { _id: string } }>(
    mutations.ADD_MEAL,
    { data }
  );
  return response.insertOneMeal._id;
};

export const deleteMeal = async (_id: string): Promise<boolean> => {
  await executeMutation(mutations.DELETE_MEAL, { query: { _id } });
  return true;
};

// ACTIVITY API

export const getActivitiesForPeriod = async (
  userId: string,
  profileId: string,
  startTime: Date,
  endTime: Date
): Promise<Activity[]> => {
  const startDate = getStartOfDay(startTime);
  const endDate = getEndOfDay(endTime);

  const response = await executeQuery<{ activities: Activity[] }>(
    queries.GET_ACTIVITIES_FOR_PERIOD,
    { userId, profileId, startDate, endDate }
  );
  return response.activities || [];
};

export const loadActivities = async (
  userId: string,
  startTime: Date,
  endTime: Date
): Promise<Activity[]> => {
  const startDate = getStartOfDay(startTime);
  const endDate = getEndOfDay(endTime);

  const response = await executeQuery<{ activities: Activity[] }>(
    queries.GET_ALL_ACTIVITIES,
    { userId, startDate, endDate }
  );
  return response.activities || [];
};

export const addActivity = async (
  data: Partial<Activity> & {
    date: Date;
    profileId: string;
    userId: string;
  }
): Promise<boolean> => {
  await executeMutation(mutations.ADD_ACTIVITY, { data });
  return true;
};

export const updateActivity = async (
  activityId: string,
  updateData: Partial<Activity>
): Promise<boolean> => {
  await executeMutation(mutations.UPDATE_ACTIVITY, {
    activityId,
    updateData,
  });
  return true;
};

export const deleteActivity = async (_id: string): Promise<boolean> => {
  await executeMutation(mutations.DELETE_ACTIVITY, { query: { _id } });
  return true;
};

// TRAINING API

export const getTrainingsForPeriod = async (
  userId: string,
  profileId: string,
  startTime: Date,
  endTime: Date
): Promise<Training[]> => {
  const startDate = getStartOfDay(startTime);
  const endDate = getEndOfDay(endTime);

  const response = await executeQuery<{ trainings: Training[] }>(
    queries.GET_TRAININGS_FOR_PERIOD,
    { userId, profileId, startDate, endDate }
  );
  return response.trainings || [];
};

export const loadTrainings = async (
  userId: string,
  profileId: string,
  startTime: Date,
  endTime: Date
): Promise<Training[]> => {
  const startDate = getStartOfDay(startTime);
  const endDate = getEndOfDay(endTime);

  const response = await executeQuery<{ trainings: Training[] }>(
    queries.GET_ALL_TRAININGS,
    { userId, profileId, startDate, endDate }
  );
  return response.trainings || [];
};

export const addTraining = async (
  data: Partial<Training> & {
    isCompleted: boolean;
    date: Date;
    profileId: string;
    userId: string;
  }
): Promise<boolean> => {
  await executeMutation(mutations.ADD_TRAINING, { data });
  return true;
};

export const updateTraining = async (
  trainingId: string,
  updateData: Partial<Training>
): Promise<boolean> => {
  await executeMutation(mutations.UPDATE_TRAINING, {
    trainingId,
    updateData,
  });
  return true;
};

export const deleteTraining = async (_id: string): Promise<boolean> => {
  await executeMutation(mutations.DELETE_TRAINING, { query: { _id } });
  return true;
};

// PROFILE API

export const getUserProfiles = async (userId: string): Promise<Profile[]> => {
  const response = await executeQuery<{ profiles: Profile[] }>(
    queries.GET_PROFILES,
    { userId }
  );
  return response.profiles || [];
};

export const getCurrentProfile = async (
  userId: string
): Promise<Profile | null> => {
  const response = await executeQuery<{ profiles: Profile[] }>(
    queries.GET_PROFILES,
    { userId }
  );

  if (!response.profiles || response.profiles.length === 0) {
    return null;
  }

  const currentProfile = response.profiles.find(
    (profile) => profile.isCurrent === true
  );
  return currentProfile || response.profiles[0];
};

export const addProfile = async (
  data: Partial<Profile>
): Promise<Profile | null> => {
  const response = await executeMutation<{ insertOneProfile: Profile }>(
    mutations.ADD_PROFILE,
    { data }
  );
  return response.insertOneProfile;
};

export const updateProfile = async (
  profileId: string,
  updateData: Partial<Profile>
): Promise<Profile | null> => {
  const response = await executeMutation<{ updateOneProfile: Profile }>(
    mutations.UPDATE_PROFILE,
    { profileId, updateData }
  );
  return response.updateOneProfile;
};

export const deleteProfile = async (_id: string): Promise<boolean> => {
  await executeMutation(mutations.DELETE_PROFILE, { query: { _id } });
  return true;
};

// FOOD CATEGORY API

export const addFoodCategory = async (
  data: Partial<FoodCategory> & {
    profileId: string;
    userId: string;
  }
): Promise<boolean> => {
  await executeMutation(mutations.ADD_FOOD_CATEGORY, { data });
  return true;
};

export const updateFoodCategory = async (
  categoryId: string,
  updateData: Partial<FoodCategory>
): Promise<boolean> => {
  await executeMutation(mutations.UPDATE_FOOD_CATEGORY, {
    categoryId,
    updateData,
  });
  return true;
};

export const deleteFoodCategory = async (_id: string): Promise<boolean> => {
  await executeMutation(mutations.DELETE_FOOD_CATEGORY, { query: { _id } });
  return true;
};
