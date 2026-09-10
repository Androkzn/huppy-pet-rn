/**
 * Main Tab Navigator — Diary, Dashboard, Training, More.
 *
 * Both bars are Liquid Glass and float over the page, so the header is
 * transparent and the tab bar draws itself absolutely: screens run full height
 * and their content passes under the chrome, which is what gives iOS 26 its
 * sense of depth. `Screen` adds the matching top and bottom clearance.
 *
 * Profile is not a tab — it is reached from the avatar in the navigation bar —
 * so it lives in the root stack.
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
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
        header: ({ route }) => <NavBar routeName={route.name} scrollKey={route.key} />,
        sceneStyle: { backgroundColor: 'transparent' },
        // Tabs cross-fade rather than slide, as they do on iOS.
        animation: 'fade',
        freezeOnBlur: true,
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Diary' }} />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="Training"
        component={TrainingScreen}
        options={{ title: 'Training' }}
      />
      <Tab.Screen name="More" component={MoreScreen} options={{ title: 'More' }} />
    </Tab.Navigator>
  );
};
