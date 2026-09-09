/**
 * Root Navigator
 * Main navigation container that switches between Auth and Main flows
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useAuth } from '@contexts/AuthContext';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { FoodNavigator } from './FoodNavigator';
import { View } from 'react-native';
import NavBar from '@components/NavBar';
import { Spinner } from '@components/ui/Asset';
import ProfileScreen from '@screens/main/ProfileScreen';
import RegisterScreen from '@screens/auth/RegisterScreen';
import * as colors from '../theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // The web shows its paw spinner while the session is restored.
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.white,
        }}
      >
        <Spinner />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainNavigator} />
            <Stack.Screen
              name="Food"
              component={FoodNavigator}
              options={{ headerShown: true, presentation: 'modal' }}
            />
            {/* Both are drawer destinations on the web, not tabs. */}
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ headerShown: true, header: () => <NavBar /> }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: true, header: () => <NavBar showLogo /> }}
            />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
