import * as graphql from "../graphql/graphqlUtils";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Enums from "../helpers/Enums.helper"


const useSearchForFood = (searchQuery, selectedFilter, selectedCategory, user) => {
  console.log("useSearchForFood", searchQuery)
    return useQuery(['searchFood', searchQuery, selectedCategory, selectedFilter], async () => {
      if (selectedFilter === Enums.FilterFood.ALL) {
        if  (searchQuery === "") return []
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
    });
  };

  const useLoadMealsForDate = (user, currentProfile, currentDate) => {
    console.log("useLoadMealsForDate", currentDate)
    return useQuery(['loadMealsForDate', currentDate], async () => {  
      return graphql. loadMeals(user, currentProfile, currentDate);
    });
  };

  const useLoadFoodCategories = (user, currentProfile, currentDate) => {
    console.log("useLoadFoodCategories", currentDate)
    return useQuery(['loadFoodCategories', currentDate], async () => {
      if (currentProfile && user) {
        if ( currentProfile?.preset !== Enums.RatioPresets.CUSTOM) {
          const allCategoriesForPresset = Enums.getCategoriesForRatioPreset(currentProfile?.dailyPortion, currentProfile?._id,  currentProfile?.preset) 
            const data = (allCategoriesForPresset).map((category) => ({ 
            name: category.name,
            weight: category.weight,
            percentage: category.percentage,
            color: category.color,
            type: category.type,
          }));
          return data
        } else {
          const categories = await  graphql.getAllFoodCategories(user, currentProfile._id); 
          const data = (categories).map((category) => ({
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
          return data
        }
      } else {
        return []
      }
    });
  };

  const useLoadFoodForDate = (user, currentProfile, currentDate, isStatisticToday) => {
    console.log("useLoadFoodForDate", currentDate)
    return useQuery(['loadFoodForDate', currentDate], async () => {
        return graphql.loadFood(user, currentProfile, currentDate, isStatisticToday);
    });
  };

  const useGetAllFoodForMeal = (user, mealId) => {
    console.log("useGetAllFoodForMeal", mealId)
    return useQuery(['getAllFoodForMeal', mealId], async () => {
        return graphql.getAllFoodForMeal(user, mealId);
    });
  };

  const useLoadActivitiesForDate = (user, currentProfile, currentDate) => {
    console.log("useLoadActivitiesForDate", currentDate)
    return useQuery(['loadActivitiesForDate', currentDate], async () => {
        return graphql.loadActivities(user, currentProfile, currentDate);
    });
  };

  const useLoadTrainingsForDate = (user, currentProfile, currentDate) => {
    console.log("useLoadTrainingsForDate", currentDate)
    return useQuery(['loadTrainingsForDate', currentDate], async () => {
        return graphql.loadTrainings(user, currentProfile, currentDate);
    });
  };


  const useAddMeal= () => {
    console.log("useAddMeal")
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: graphql.addMeal,
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries(["loadMealsForDate"]);
      }
    });
  };

  const useAddActivity= () => {
    console.log("useAddActivity")
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: graphql.addActivity,
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries(["loadActivitiesForDate"]);
        queryClient.invalidateQueries(["loadFoodForDate"]);
      }
    });
  };

  const useAddTraining = () => {
    console.log("useAddTraining")
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: graphql.addTraining,
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries(["loadTrainingsForDate"]);
      }
    });
  };

  const useUpdateTraining= () => {
    console.log("useUpdateTraining")
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: graphql.updateTraining,
      onSuccess: () => {
        queryClient.invalidateQueries(["loadTrainingsForDate"]);
      }
    });
  }

  const useAddFoodCategory = () => {
    console.log("useAddFoodCategory")
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: graphql.addFoodCategory,
      onSuccess: () => {
        queryClient.invalidateQueries(["loadFoodCategories"]);
      }
    });
  };

  const useAddFoodTemplate = () => {
    console.log("useAddFoodTemplate")
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: graphql.addFoodTemplate,
      onSuccess: data => {
        const { templateId } = data;
        queryClient.invalidateQueries(["searchFood"]);
      }
    });
  };

  const useUpdateFoodTemplate= () => {
    console.log("useUpdateFoodTemplate")
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: graphql.updateFoodTemplate,
      onSuccess: () => {
       queryClient.invalidateQueries(["searchFood"]);
      }
    });
  }

  const useUpdateFood= () => {
    console.log("useUpdateFood")
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: graphql.updateFood,
      onSuccess: () => {
       queryClient.invalidateQueries(["getAllFoodForMeal"]);
       queryClient.invalidateQueries(["loadFoodForDate"]);
      }
    });
  }

  const useUpdateFoodCategory= () => {
    console.log("useUpdateFoodCategory")
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: graphql.updateFoodCategory,
      onSuccess: () => {
       queryClient.invalidateQueries(["loadFoodCategories"]);
      }
    });
  }
  
  const useAddFood= () => {
    console.log("useAddFood")
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: graphql.addFood,
      onSuccess: () => {
        queryClient.invalidateQueries(["getAllFoodForMeal"]);
      }
    });
  }

  const useDeleteFood= () => {
    console.log("useDeleteFood")
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: graphql.deleteFood,
      onSuccess: () => {
       queryClient.invalidateQueries(["getAllFoodForMeal"]);
       queryClient.invalidateQueries(["loadFoodForDate"]);
      }
    });
  }

  const useDeleteMeal= () => {
    console.log("useDeleteMeal")
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: graphql.deleteMeal,
      onSuccess: () => {
        queryClient.invalidateQueries(["loadMealsForDate"]);
        queryClient.invalidateQueries(["loadFoodForDate"]);
      }
    });
  }

  const useDeleteActivity= () => {
    console.log("useDeleteActivity")
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: graphql.deleteActivity,
      onSuccess: () => {
        queryClient.invalidateQueries(["loadActivitiesForDate"]);
        queryClient.invalidateQueries(["loadFoodForDate"]);
      }
    });
  }

    const useDeleteFoodTemplate= () => {
    console.log("useDeleteFoodTemplate")
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: graphql.deleteFoodTemplate,
      onSuccess: () => {
        queryClient.invalidateQueries(["searchFood"]);
      }
    });
  }

  const useUpdateActivity= () => {
    console.log("useUpdateActivity")
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: graphql.updateActivity,
      onSuccess: () => {
        queryClient.invalidateQueries(["loadActivitiesForDate"]);
        queryClient.invalidateQueries(["loadFoodForDate"]);
      }
    });
  }

  const useUpdateProfile= () => {
    console.log("useUpdateProfile")
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: graphql.updateProfile,
      onSuccess: () => {
        queryClient.invalidateQueries([""]);
      }
    });
  }

  const useDeleteTraining= () => {
    console.log("useDeleteTraining")
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: graphql.deleteTraining,
      onSuccess: () => {
        queryClient.invalidateQueries(["loadTrainingsForDate"]);
      }
    });
  }

  const useDeleteFoodCategory= () => {
    console.log("useDeleteFoodCategory")
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: graphql.deleteFoodCategory,
      onSuccess: () => {
        queryClient.invalidateQueries(["loadFoodCategories"]);
      }
    });
  }

export { 
    useSearchForFood,
    useLoadFoodForDate,
    useLoadActivitiesForDate,
    useLoadTrainingsForDate,
    useLoadFoodCategories,
    useLoadMealsForDate,
    useAddMeal,
    useAddFood,
    useAddFoodTemplate,
    useAddActivity,
    useAddTraining,
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

}