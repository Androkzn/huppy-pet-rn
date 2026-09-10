/**
 * Food Stack Navigator — the meal-building flow.
 *
 * Presented as a sheet from the diary, so it keeps its own glass bar with a
 * back control and the title of the step in progress.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NavBar from '@components/NavBar';
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
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
        fullScreenGestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="SearchFood"
        component={SearchFoodScreen}
        options={{
          title: 'Add food',
          header: ({ route, options }) => (
            <NavBar title={options.title} scrollKey={route.key} />
          ),
        }}
      />
      <Stack.Screen
        name="AddFood"
        component={AddFoodScreen}
        options={{
          title: 'Portion',
          header: ({ route, options }) => (
            <NavBar title={options.title} scrollKey={route.key} />
          ),
        }}
      />
      <Stack.Screen
        name="EditFood"
        component={EditFoodScreen}
        options={{
          title: 'Edit food',
          header: ({ route, options }) => (
            <NavBar title={options.title} scrollKey={route.key} />
          ),
        }}
      />
      <Stack.Screen
        name="CreateNewFood"
        component={CreateNewFoodScreen}
        options={{
          title: 'New food',
          header: ({ route, options }) => (
            <NavBar title={options.title} scrollKey={route.key} />
          ),
        }}
      />
    </Stack.Navigator>
  );
};
