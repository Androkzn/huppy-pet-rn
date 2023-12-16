import * as graphql from "../graphql/graphqlUtils";
import { useQuery, useMutation } from '@tanstack/react-query';
import * as Enums from "../helpers/Enums.helper"


const useSearchForFood = (searchQuery, selectedFilter, selectedCategory, user) => {
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
    return useQuery(['loadMealsForDate', currentDate], async () => {  
      return graphql. loadMeals(user, currentProfile, currentDate);
    });
  };

  const useLoadFoodCategories = (user, currentProfile, currentDate) => {
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
          console.log("useLoadFoodCategories data:", data )
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
          console.log("useLoadFoodCategories data:", data )
          return data
        }
      } else {
        return []
      }
    });
  };

  const useLoadFoodForDate = (user, currentProfile, currentDate, isStatisticToday) => {
    return useQuery(['loadFoodForDate', currentDate], async () => {
        return graphql.loadFood(user, currentProfile, currentDate, isStatisticToday);
    });
  };

  const useLoadActivitiesForDate = (user, currentProfile, currentDate) => {
    return useQuery(['loadActivitiesForDate', currentDate], async () => {
        return graphql.loadActivities(user, currentProfile, currentDate);
    });
  };

export { 
    useSearchForFood,
    useLoadFoodForDate,
    useLoadActivitiesForDate,
    useLoadFoodCategories,
    useLoadMealsForDate,

}