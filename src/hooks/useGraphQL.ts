/**
 * React Query hooks for GraphQL operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@services/api/graphqlApi';
import { useAuth } from '@contexts/AuthContext';
import { useProfile } from '@contexts/ProfileContext';
import type {
  Food,
  FoodTemplate,
  FoodCategory,
  Meal,
  Activity,
  Training,
  Profile,
} from '../types';

// QUERY HOOKS - FOOD

export const useSearchForFood = (
  searchQuery: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['searchFood', searchQuery],
    queryFn: () => api.searchForFood(searchQuery),
    enabled: enabled && searchQuery.length > 0,
  });
};

export const useGetAllFoodForMeal = (mealId: string, profileId: string) => {
  return useQuery({
    queryKey: ['getAllFoodForMeal', mealId],
    queryFn: () => api.getAllFoodForMeal(mealId, profileId),
    enabled: !!mealId && !!profileId,
  });
};

export const useGetFoodForPeriod = (
  userId: string,
  profileId: string,
  startTime: Date,
  endTime: Date
) => {
  return useQuery({
    queryKey: ['getFoodForPeriod', startTime, endTime],
    queryFn: () => api.getFoodForPeriod(userId, profileId, startTime, endTime),
    enabled: !!userId && !!profileId,
  });
};

export const useGetFoodForDate = (
  userId: string,
  profileId: string,
  currentDate: Date
) => {
  return useQuery({
    queryKey: ['loadFoodForDate', currentDate],
    queryFn: () => api.loadFood(userId, profileId, currentDate, currentDate),
    enabled: !!userId && !!profileId,
  });
};

export const useGetAllCustomFoodTemplates = () => {
  return useQuery({
    queryKey: ['customFoodTemplates'],
    queryFn: () => api.getAllCustomFoodTemplates(),
  });
};

export const useGetAllFoodTemplatesForCategory = (categoryType: string) => {
  return useQuery({
    queryKey: ['foodTemplatesForCategory', categoryType],
    queryFn: () => api.getAllFoodTemplatesForCategory(categoryType),
    enabled: !!categoryType,
  });
};

export const useGetAllFoodCategories = (profileId: string) => {
  return useQuery({
    queryKey: ['foodCategories', profileId],
    queryFn: () => api.getAllFoodCategories(profileId),
    enabled: !!profileId,
  });
};

export const useGetFoodTemplateById = (id: string) => {
  return useQuery({
    queryKey: ['foodTemplate', id],
    queryFn: () => api.getFoodTemplateById(id),
    enabled: !!id,
  });
};

export const useGetFoodById = (id: string) => {
  return useQuery({
    queryKey: ['food', id],
    queryFn: () => api.getFoodById(id),
    enabled: !!id,
  });
};

// QUERY HOOKS - MEALS

export const useGetMealsForDate = (
  userId: string,
  startDate: Date,
  endDate: Date
) => {
  return useQuery({
    queryKey: ['loadMealsForDate', startDate],
    queryFn: () => api.loadMeals(userId, startDate, endDate),
    enabled: !!userId,
  });
};

// QUERY HOOKS - ACTIVITIES

export const useGetActivitiesForPeriod = (
  userId: string,
  profileId: string,
  startTime: Date,
  endTime: Date
) => {
  return useQuery({
    queryKey: ['getActivitiesForPeriod', startTime, endTime],
    queryFn: () =>
      api.getActivitiesForPeriod(userId, profileId, startTime, endTime),
    enabled: !!userId && !!profileId,
  });
};

export const useGetActivitiesForDate = (
  userId: string,
  currentDate: Date
) => {
  return useQuery({
    queryKey: ['loadActivitiesForDate', currentDate],
    queryFn: () => api.loadActivities(userId, currentDate, currentDate),
    enabled: !!userId,
  });
};

// QUERY HOOKS - TRAININGS

export const useGetTrainingsForPeriod = (
  userId: string,
  profileId: string,
  startTime: Date,
  endTime: Date
) => {
  return useQuery({
    queryKey: ['getTrainingsForPeriod', startTime, endTime],
    queryFn: () =>
      api.getTrainingsForPeriod(userId, profileId, startTime, endTime),
    enabled: !!userId && !!profileId,
  });
};

export const useGetTrainingsForDate = (
  userId: string,
  profileId: string,
  currentDate: Date
) => {
  return useQuery({
    queryKey: ['loadTrainingsForDate', currentDate],
    queryFn: () =>
      api.loadTrainings(userId, profileId, currentDate, currentDate),
    enabled: !!userId && !!profileId,
  });
};

// QUERY HOOKS - PROFILES

export const useGetProfiles = (userId: string) => {
  return useQuery({
    queryKey: ['getProfiles', userId],
    queryFn: () => api.getUserProfiles(userId),
    enabled: !!userId,
  });
};

export const useGetCurrentProfile = (userId: string) => {
  return useQuery({
    queryKey: ['getCurrentProfile', userId],
    queryFn: () => api.getCurrentProfile(userId),
    enabled: !!userId,
  });
};

// MUTATION HOOKS - FOOD

export const useAddFood = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.addFood,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAllFoodForMeal'] });
      queryClient.invalidateQueries({ queryKey: ['loadFoodForDate'] });
    },
  });
};

export const useUpdateFood = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ foodId, updateData }: { foodId: string; updateData: Partial<Food> }) =>
      api.updateFood(foodId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAllFoodForMeal'] });
      queryClient.invalidateQueries({ queryKey: ['loadFoodForDate'] });
    },
  });
};

export const useDeleteFood = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (_id: string) => api.deleteFood(_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAllFoodForMeal'] });
      queryClient.invalidateQueries({ queryKey: ['loadFoodForDate'] });
    },
  });
};

// MUTATION HOOKS - FOOD TEMPLATES

export const useAddFoodTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.addFoodTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['searchFood'] });
      queryClient.invalidateQueries({ queryKey: ['customFoodTemplates'] });
    },
  });
};

export const useUpdateFoodTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      templateId,
      updateData,
    }: {
      templateId: string;
      updateData: Partial<FoodTemplate>;
    }) => api.updateFoodTemplate(templateId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['searchFood'] });
      queryClient.invalidateQueries({ queryKey: ['customFoodTemplates'] });
    },
  });
};

export const useDeleteFoodTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (_id: string) => api.deleteFoodTemplate(_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['searchFood'] });
      queryClient.invalidateQueries({ queryKey: ['customFoodTemplates'] });
    },
  });
};

// MUTATION HOOKS - MEALS

export const useAddMeal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.addMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loadMealsForDate'] });
    },
  });
};

export const useDeleteMeal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (_id: string) => api.deleteMeal(_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loadMealsForDate'] });
      queryClient.invalidateQueries({ queryKey: ['loadFoodForDate'] });
    },
  });
};

// MUTATION HOOKS - ACTIVITIES

export const useAddActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.addActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loadActivitiesForDate'] });
      queryClient.invalidateQueries({ queryKey: ['loadFoodForDate'] });
    },
  });
};

export const useUpdateActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      activityId,
      updateData,
    }: {
      activityId: string;
      updateData: Partial<Activity>;
    }) => api.updateActivity(activityId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loadActivitiesForDate'] });
      queryClient.invalidateQueries({ queryKey: ['loadFoodForDate'] });
    },
  });
};

export const useDeleteActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (_id: string) => api.deleteActivity(_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loadActivitiesForDate'] });
      queryClient.invalidateQueries({ queryKey: ['loadFoodForDate'] });
    },
  });
};

// MUTATION HOOKS - TRAININGS

export const useAddTraining = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.addTraining,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loadTrainingsForDate'] });
    },
  });
};

export const useUpdateTraining = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      trainingId,
      updateData,
    }: {
      trainingId: string;
      updateData: Partial<Training>;
    }) => api.updateTraining(trainingId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loadTrainingsForDate'] });
    },
  });
};

export const useDeleteTraining = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (_id: string) => api.deleteTraining(_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loadTrainingsForDate'] });
    },
  });
};

// MUTATION HOOKS - PROFILES

export const useAddProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.addProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getProfiles'] });
      queryClient.invalidateQueries({ queryKey: ['getCurrentProfile'] });
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      profileId,
      updateData,
    }: {
      profileId: string;
      updateData: Partial<Profile>;
    }) => api.updateProfile(profileId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getCurrentProfile'] });
      queryClient.invalidateQueries({ queryKey: ['getProfiles'] });
      queryClient.invalidateQueries({ queryKey: ['foodCategories'] });
    },
  });
};

export const useDeleteProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (_id: string) => api.deleteProfile(_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getProfiles'] });
      queryClient.invalidateQueries({ queryKey: ['getCurrentProfile'] });
    },
  });
};

// MUTATION HOOKS - FOOD CATEGORIES

export const useAddFoodCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.addFoodCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodCategories'] });
    },
  });
};

export const useUpdateFoodCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      categoryId,
      updateData,
    }: {
      categoryId: string;
      updateData: Partial<FoodCategory>;
    }) => api.updateFoodCategory(categoryId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodCategories'] });
    },
  });
};

export const useDeleteFoodCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (_id: string) => api.deleteFoodCategory(_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodCategories'] });
    },
  });
};
