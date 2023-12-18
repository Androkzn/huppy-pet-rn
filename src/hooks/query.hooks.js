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
            name: category.name,
            weight: category.weight,
            percentage: category.percentage,
            color: category.color,
            type: category.type,
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
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries(["loadTrainingsForDate"]);
      }
    });
  }

  const useAddFoodCategory = () => {
    console.log("useAddFoodCategory")
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: graphql.addFoodCategory,
      onSuccess: (data, variables, context) => {
        //queryClient.invalidateQueries([" "]);
      }
    });
  };

  const useAddFoodTemplate = () => {
    console.log("useAddFoodTemplate")
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: graphql.addFoodTemplate,
      onSuccess: (data, variables, context) => {
        //queryClient.invalidateQueries([" "]);
      }
    });
  };

  const useUpdateFood= () => {
    console.log("useUpdateFood")
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: graphql.updateFood,
      onSuccess: (data, variables, context) => {
       queryClient.invalidateQueries(["getAllFoodForMeal"]);
       queryClient.invalidateQueries(["loadFoodForDate"]);
      }
    });
  }
  
  const useAddFood= () => {
    console.log("useAddFood")
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: graphql.addFood,
      onSuccess: (data, variables, context) => {
        console.log("useAddFood onSuccess");
        queryClient.invalidateQueries(["getAllFoodForMeal"]);
      }
    });
  }

  const useDeleteFood= () => {
    console.log("useDeleteFood")
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: graphql.deleteFood,
      onSuccess: (data, variables, context) => {
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
      onSuccess: (data, variables, context) => {
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
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries(["loadActivitiesForDate"]);
        queryClient.invalidateQueries(["loadFoodForDate"]);
      }
    });
  }

  const useUpdateActivity= () => {
    console.log("useUpdateActivity")
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: graphql.updateActivity,
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries(["loadActivitiesForDate"]);
        queryClient.invalidateQueries(["loadFoodForDate"]);
      }
    });
  }

  const useDeleteTraining= () => {
    console.log("useDeleteTraining")
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: graphql.deleteTraining,
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries(["loadTrainingsForDate"]);
      }
    });
  }

  const useFoodTemplate= () => {
    console.log("useFoodTemplate")
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: graphql.deleteFoodTemplate,
      onSuccess: (data, variables, context) => {
        //queryClient.invalidateQueries([" "]);
      }
    });
  }


  const useDeleteFoodCategory= () => {
    console.log("useDeleteFoodCategory")
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: graphql.deleteFoodCategory,
      onSuccess: (data, variables, context) => {
        //queryClient.invalidateQueries([" "]);
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
    useUpdateTraining,
    useUpdateActivity,
    useDeleteFood,
    useDeleteMeal,
    useDeleteActivity,
    useDeleteTraining,
    useFoodTemplate,
    useDeleteFoodCategory,

}