/**
 * Root Navigator — switches between the auth and main flows.
 *
 * The container's theme is derived from the app palette so React Navigation's
 * own surfaces (card backgrounds, the interactive back gesture's shadow) follow
 * the appearance. Screens outside the tabs keep the same transparent glass
 * header, and the food flow is presented as a sheet, which is how iOS presents
 * a self-contained task.
 */

import React, { useMemo } from 'react';
import { View } from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  type Theme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useAuth } from '@contexts/AuthContext';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { FoodNavigator } from './FoodNavigator';
import NavBar from '@components/NavBar';
import { Spinner } from '@components/ui/Asset';
import ProfileScreen from '@screens/main/ProfileScreen';
import RegisterScreen from '@screens/auth/RegisterScreen';
import NotFoundScreen from '@screens/NotFoundScreen';
import { useAppTheme } from '@theme/ThemeProvider';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { user, isLoading } = useAuth();
  const { colors, isDark } = useAppTheme();

  const navigationTheme: Theme = useMemo(
    () => ({
      ...(isDark ? DarkTheme : DefaultTheme),
      colors: {
        ...(isDark ? DarkTheme : DefaultTheme).colors,
        primary: colors.tint,
        background: colors.groupedBackground,
        card: colors.groupedSurface,
        text: colors.label,
        border: colors.separator,
        notification: colors.tint,
      },
    }),
    [colors, isDark]
  );

  if (isLoading) {
    // The paw spinner keeps its place while the session is restored.
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.groupedBackground,
        }}
      >
        <Spinner />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.groupedBackground },
          // iOS 26 keeps the interactive back gesture across the whole screen.
          fullScreenGestureEnabled: true,
        }}
      >
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainNavigator} />
            <Stack.Screen
              name="Food"
              component={FoodNavigator}
              options={{ presentation: 'modal' }}
            />
            {/* Both are reached from the profile switcher, not the tabs. */}
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                headerShown: true,
                headerTransparent: true,
                header: ({ route }) => (
                  <NavBar routeName="Profile" scrollKey={route.key} />
                ),
              }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{
                headerShown: true,
                headerTransparent: true,
                presentation: 'modal',
                header: ({ route }) => (
                  <NavBar routeName="Register" scrollKey={route.key} />
                ),
              }}
            />
            <Stack.Screen
              name="NotFound"
              component={NotFoundScreen}
              options={{
                headerShown: true,
                headerTransparent: true,
                header: ({ route }) => (
                  <NavBar routeName="NotFound" scrollKey={route.key} />
                ),
              }}
            />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
