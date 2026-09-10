/**
 * Auth Stack Navigator — login, sign-up, password reset and the first profile.
 *
 * The auth screens carry the wordmark in a transparent glass bar, so the
 * artwork behind them runs to the top edge.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import NavBar from '@components/NavBar';

import LoginScreen from '@screens/auth/LoginScreen';
import SignupScreen from '@screens/auth/SignupScreen';
import ForgotPasswordScreen from '@screens/auth/ForgotPasswordScreen';
import RegisterScreen from '@screens/auth/RegisterScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
        header: ({ route }) => <NavBar showLogo scrollKey={route.key} />,
        animation: 'slide_from_right',
        fullScreenGestureEnabled: true,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};
