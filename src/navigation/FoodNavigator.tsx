/**
 * Food Stack Navigator
 * Nested navigation for food search and management
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchFoodScreen from '@screens/food/SearchFoodScreen';
import AddFoodScreen from '@screens/food/AddFoodScreen';
import EditFoodScreen from '@screens/food/EditFoodScreen';
import CreateNewFoodScreen from '@screens/food/CreateNewFoodScreen';

export type FoodStackParamList = {
  SearchFood: { mealId: string };
  AddFood: { mealId: string; foodTemplateId: string };
  EditFood: { foodId: string };
  CreateNewFood: { mealId: string };
};

const Stack = createNativeStackNavigator<FoodStackParamList>();

export const FoodNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchFood"
        component={SearchFoodScreen}
        options={{ title: 'Search Food' }}
      />
      <Stack.Screen
        name="AddFood"
        component={AddFoodScreen}
        options={{ title: 'Add Food to Meal' }}
      />
      <Stack.Screen
        name="EditFood"
        component={EditFoodScreen}
        options={{ title: 'Edit Food' }}
      />
      <Stack.Screen
        name="CreateNewFood"
        component={CreateNewFoodScreen}
        options={{ title: 'Create Custom Food' }}
      />
    </Stack.Navigator>
  );
};
