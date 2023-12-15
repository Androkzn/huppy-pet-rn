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

export { 
    useSearchForFood,
}