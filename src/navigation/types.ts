/**
 * Navigation type definitions
 */

import { NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Root Stack Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  Food: NavigatorScreenParams<FoodStackParamList>;
  // Reached from the NavBar avatar drawer, as on the web.
  Profile: undefined;
  Register: undefined;
  // The web router's catch-all route.
  NotFound: undefined;
};

// Auth Stack Navigator
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  Register: undefined;
};

// Main Tab Navigator — the web's four tabs (Diary, Dashboard, Training, More)
export type MainTabParamList = {
  Home: undefined;
  Dashboard: undefined;
  Training: undefined;
  More: undefined;
};

// Food Stack Navigator (nested in Home)
export type FoodStackParamList = {
  SearchFood: { mealId: string };
  AddFood: { mealId: string; foodTemplateId: string };
  EditFood: { foodId: string };
  CreateNewFood: undefined;
};

// Screen Props Types
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  BottomTabScreenProps<MainTabParamList, T>;

export type FoodStackScreenProps<T extends keyof FoodStackParamList> =
  NativeStackScreenProps<FoodStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
