/**
 * Main App Component
 * Expo Entry Point
 */

import React from 'react';
import { View, LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  useFonts,
  BalsamiqSans_400Regular,
  BalsamiqSans_400Regular_Italic,
  BalsamiqSans_700Bold,
  BalsamiqSans_700Bold_Italic,
} from '@expo-google-fonts/balsamiq-sans';

import { theme } from './src/theme';
import * as colors from './src/theme/colors';
import { AuthProvider } from './src/contexts/AuthContext';
import { ProfileProvider } from './src/contexts/ProfileContext';
import { DateProvider } from './src/contexts/DateContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { seedPreviewData, PREVIEW_DATE } from './src/dev/previewData';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // TEMPORARY: preview mode keeps the seeded fixtures and never refetches.
      retry: false,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  },
});

// TEMPORARY: seeded before first render so the screens read fixtures, not the
// offline backend. The LogBox overlay is muted so it does not cover the TabBar.
seedPreviewData(queryClient, PREVIEW_DATE);
LogBox.ignoreAllLogs(true);

export default function App() {
  // The web loads Balsamiq Sans from Google Fonts in index.html.
  const [fontsLoaded] = useFonts({
    BalsamiqSans_400Regular,
    BalsamiqSans_400Regular_Italic,
    BalsamiqSans_700Bold,
    BalsamiqSans_700Bold_Italic,
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.white }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, width: '100%' }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <PaperProvider theme={theme}>
            <AuthProvider>
              <ProfileProvider>
                <DateProvider>
                  <RootNavigator />
                  <StatusBar style="dark" />
                </DateProvider>
              </ProfileProvider>
            </AuthProvider>
          </PaperProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
