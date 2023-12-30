import * as graphql from '../graphql/graphqlUtils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Enums from '../helpers/Enums.helper';
import axios from 'axios';

//////////////////////////////
//     GET IMAGE           //
////////////////////////////
// GET IMAGE
const useFetchImage = (url, key) => {
  // console.log("Attempt to useFetchImage with key", key);
  return useQuery(
    [key],
    async () => {
      try {
        const avatarResult = await axios.get(url);
        console.error('FETCHED avatarResult.data:', avatarResult.data);
        return avatarResult.data;
      } catch (error) {
        console.log('Error fetching avatar:', error);
        throw error; // Rethrow the error to let React Query handle it
      }
    },
    {
      enabled: !!key,
      refetchOnMount: false,
      onSuccess: (data) => {},
    }
  );
};

//////////////////////////////
//     GET / SEARCH        //
////////////////////////////

// SEARCH FOOD
const useSearchForFood = (
  searchQuery,
  selectedFilter,
  selectedCategory,
  user
) => {
  return useQuery(
    ['searchFood', searchQuery, selectedCategory, selectedFilter],
    async () => {
      if (selectedFilter === Enums.FilterFood.ALL) {
        if (searchQuery === '') return [];
        return graphql.searchForFood(searchQuery, user);
      } else if (selectedFilter === Enums.FilterFood.CATEGORY) {
        return graphql.getAllFoodTemplatesForCategory(user, selectedCategory);
      } else if (selectedFilter === Enums.FilterFood.CUSTOM) {
        return graphql.getAllCustomFoodTemplates(user);
      } else if (selectedFilter === Enums.FilterFood.RECIPE) {
        return [];
      } else {
        return [];
      }
    }
  );
};

// GET MEALS
const useGetMealsForDate = (user, currentProfile, currentDate) => {
  return useQuery(['loadMealsForDate', currentDate], async () => {
    return graphql.loadMeals(user, currentProfile, currentDate);
  });
};

// GET FOOD CATEGORIES
const useLoadFoodCategories = (user, currentProfile, preset) => {
  return useQuery(['loadFoodCategories', preset], async () => {
    if (currentProfile && user) {
      if (currentProfile?.preset !== Enums.RatioPresets.CUSTOM) {
        const allCategoriesForPresset = Enums.getCategoriesForRatioPreset(
          currentProfile?.dailyPortion,
          currentProfile?._id,
          currentProfile?.preset
        );
        let data = allCategoriesForPresset.map((category) => ({
          name: category.name,
          weight: category.weight,
          percentage: category.percentage,
          color: category.color,
          type: category.type,
        }));

        // Add optionalCategory to the data array
        let optionalCategory = Enums.getDefaultCategory(
          Enums.FoodCategoryType.OTHER,
          currentProfile._id
        );
        data.push({
          name: optionalCategory.name,
          weight: optionalCategory.weight,
          percentage: optionalCategory.percentage,
          color: optionalCategory.color,
          type: optionalCategory.type,
        });

        return data;
      } else {
        const categories = await graphql.getAllFoodCategories(
          user,
          currentProfile._id
        );
        let data = categories.map((category) => ({
          _id: category._id,
          name: category.name,
          weight: category.weight,
          percentage: category.percentage,
          color: category.color,
          type: category.type,
          index: category.index,
          profileId: category.profileId,
          userId: category.userId,
        }));

        // Add optionalCategory to the data array
        let optionalCategory = Enums.getDefaultCategory(
          Enums.FoodCategoryType.OTHER,
          currentProfile._id
        );
        data.push({
          name: optionalCategory.name,
          weight: optionalCategory.weight,
          percentage: optionalCategory.percentage,
          color: optionalCategory.color,
          type: optionalCategory.type,
        });
        return data;
      }
    } else {
      return [];
    }
  });
};

// GET FOOD
const useGetFoodForDate = (
  user,
  currentProfile,
  currentDate,
  isStatisticToday
) => {
  return useQuery(['loadFoodForDate', currentDate], async () => {
    return graphql.loadFood(
      user,
      currentProfile,
      currentDate,
      isStatisticToday
    );
  });
};

// GET FOOD FOR MEAL
const useGetAllFoodForMeal = (user, currentProfile, mealId) => {
  return useQuery(['getAllFoodForMeal', mealId], async () => {
    return graphql.getAllFoodForMeal(user, currentProfile, mealId);
  });
};

// GET ACTIVITY
const useGetActivitiesForDate = (user, currentProfile, currentDate) => {
  return useQuery(['loadActivitiesForDate', currentDate], async () => {
    return graphql.loadActivities(user, currentProfile, currentDate);
  });
};

// GET TRAINING
const useGetTrainingsForDate = (user, currentProfile, currentDate) => {
  return useQuery(['loadTrainingsForDate', currentDate], async () => {
    return graphql.loadTrainings(user, currentProfile, currentDate);
  });
};

// GET PTOFILES
const useGetProfiles = (user) => {
  return useQuery(['getProfiles', user?._accessToken], async () => {
    return graphql.getUserProfiles(user);
  });
};

// GET CURRENT PROFILE
const useGetCurrentProfile = (user) => {
  return useQuery(['getCurrentProfile', user?._accessToken], async () => {
    return graphql.getCurrentProfile(user);
  });
};

// GET FOOD FOR TIME PERIOD
const useGetFoodForPeriod = (user, currentProfile, startTime, endTime) => {
  return useQuery(['getCaloriesForPeriod', startTime, endTime], async () => {
    return graphql.getFoodForPeriod(user, currentProfile, startTime, endTime);
  });
};

// GET ACTIVITIES FOR TIME PERIOD
const useGetActivitiesForPeriod = (
  user,
  currentProfile,
  startTime,
  endTime
) => {
  return useQuery(['getActivitiesForPeriod', startTime, endTime], async () => {
    return graphql.getActivitiesForPeriod(
      user,
      currentProfile,
      startTime,
      endTime
    );
  });
};

// GET TRAININGS FOR TIME PERIOD
const useGetTrainingsForPeriod = (user, currentProfile, startTime, endTime) => {
  return useQuery(['geTrainingsForPeriod', startTime, endTime], async () => {
    return graphql.getTrainingsForPeriod(
      user,
      currentProfile,
      startTime,
      endTime
    );
  });
};

//////////////////////////////
//     CREATE / ADD        //
////////////////////////////

// MEAL
const useAddMeal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: graphql.addMeal,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['loadMealsForDate']);
      return data;
    },
  });
};

// ACTIVITY
const useAddActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: graphql.addActivity,
    onSuccess: () => {
      queryClient.invalidateQueries(['loadActivitiesForDate']);
      queryClient.invalidateQueries(['loadFoodForDate']);
    },
  });
};

// TRAINING
const useAddTraining = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: graphql.addTraining,
    onSuccess: () => {
      queryClient.invalidateQueries(['loadTrainingsForDate']);
    },
  });
};

// FOOD CATEGORY
const useAddFoodCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: graphql.addFoodCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['loadFoodCategories']);
    },
  });
};

// PROFILE
const useAddProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: graphql.addProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(['getProfiles']);
    },
  });
};

// FOOD TEMPLATE
const useAddFoodTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: graphql.addFoodTemplate,
    onSuccess: (data) => {
      const { templateId } = data;
      queryClient.invalidateQueries(['searchFood']);
    },
  });
};

// FOOD
const useAddFood = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: graphql.addFood,
    onSuccess: () => {
      queryClient.invalidateQueries(['getAllFoodForMeal']);
    },
  });
};

/////////////////////////////
//         UPDATE         //
////////////////////////////

// TRAINING
const useUpdateTraining = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: graphql.updateTraining,
    onSuccess: () => {
      queryClient.invalidateQueries(['loadTrainingsForDate']);
    },
  });
};
// FOOD TEMPLATE
const useUpdateFoodTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: graphql.updateFoodTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries(['searchFood']);
    },
  });
};

// FOOD
const useUpdateFood = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: graphql.updateFood,
    onSuccess: () => {
      queryClient.invalidateQueries(['getAllFoodForMeal']);
      queryClient.invalidateQueries(['loadFoodForDate']);
    },
  });
};

// FOOD CATEGORY
const useUpdateFoodCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: graphql.updateFoodCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['loadFoodCategories']);
    },
  });
};

// ACTIVITY
const useUpdateActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: graphql.updateActivity,
    onSuccess: () => {
      queryClient.invalidateQueries(['loadActivitiesForDate']);
      queryClient.invalidateQueries(['loadFoodForDate']);
    },
  });
};

// PROFILE
const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: graphql.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(['getCurrentProfile']);
      queryClient.invalidateQueries(['getProfiles']);
      queryClient.invalidateQueries(['loadFoodCategories']);
    },
  });
};

///////////////////////////////
//        DELETE            //
//////////////////////////////

// FOOD
const useDeleteFood = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: graphql.deleteFood,
    onSuccess: () => {
      queryClient.invalidateQueries(['getAllFoodForMeal']);
      queryClient.invalidateQueries(['loadFoodForDate']);
    },
  });
};

// MEAL
const useDeleteMeal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: graphql.deleteMeal,
    onSuccess: () => {
      queryClient.invalidateQueries(['loadMealsForDate']);
      queryClient.invalidateQueries(['loadFoodForDate']);
    },
  });
};

//ACTIVITY
const useDeleteActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: graphql.deleteActivity,
    onSuccess: () => {
      queryClient.invalidateQueries(['loadActivitiesForDate']);
      queryClient.invalidateQueries(['loadFoodForDate']);
    },
  });
};

// FOOD TEMPLATE
const useDeleteFoodTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: graphql.deleteFoodTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries(['searchFood']);
    },
  });
};

// TRAINING
const useDeleteTraining = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: graphql.deleteTraining,
    onSuccess: () => {
      queryClient.invalidateQueries(['loadTrainingsForDate']);
    },
  });
};

// FOOD CATEGORY
const useDeleteFoodCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: graphql.deleteFoodCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['loadFoodCategories']);
    },
  });
};

export {
  useFetchImage,
  useGetCurrentProfile,
  useGetProfiles,
  useSearchForFood,
  useGetFoodForDate,
  useGetActivitiesForDate,
  useGetTrainingsForDate,
  useLoadFoodCategories,
  useGetTrainingsForPeriod,
  useGetActivitiesForPeriod,
  useGetMealsForDate,
  useGetFoodForPeriod,
  useAddMeal,
  useAddFood,
  useAddFoodTemplate,
  useAddActivity,
  useAddTraining,
  useAddProfile,
  useAddFoodCategory,
  useGetAllFoodForMeal,
  useUpdateFood,
  useUpdateProfile,
  useUpdateFoodTemplate,
  useUpdateFoodCategory,
  useUpdateTraining,
  useUpdateActivity,
  useDeleteFood,
  useDeleteMeal,
  useDeleteFoodTemplate,
  useDeleteActivity,
  useDeleteTraining,
  useDeleteFoodCategory,
};
