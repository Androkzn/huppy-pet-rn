/**
 * Main Tab Navigator
 *
 * Mirrors the web app's TabBar: four tabs — Diary, Dashboard, Training, More.
 * Profile is not a tab on the web either; it is reached from the avatar drawer
 * in the NavBar, so it lives in the root stack.
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import NavBar from '@components/NavBar';
import TabBar from '@components/TabBar';

import HomeScreen from '@screens/main/HomeScreen';
import DashboardScreen from '@screens/main/DashboardScreen';
import TrainingScreen from '@screens/main/TrainingScreen';
import MoreScreen from '@screens/main/MoreScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Web renders a fixed AppBar above every page.
        headerShown: true,
        header: () => <NavBar routeName={route.name} />,
      })}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Training" component={TrainingScreen} />
      <Tab.Screen name="More" component={MoreScreen} />
    </Tab.Navigator>
  );
};
