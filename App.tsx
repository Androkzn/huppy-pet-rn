/**
 * Main App Component
 * Expo Entry Point
 */

import React from 'react';
import { View } from 'react-native';
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

import { ThemeProvider, useAppTheme, usePaperTheme } from './src/theme/ThemeProvider';
import { AuthProvider } from './src/contexts/AuthContext';
import { ProfileProvider } from './src/contexts/ProfileContext';
import { DateProvider } from './src/contexts/DateContext';
import { RootNavigator } from './src/navigation/RootNavigator';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Everything below the theme provider, so the Paper theme and the status bar
 * follow the appearance the provider resolved.
 */
const ThemedApp = () => {
  const paperTheme = usePaperTheme();
  const { colors, isDark } = useAppTheme();

  return (
    <PaperProvider theme={paperTheme}>
      <View style={{ flex: 1, backgroundColor: colors.groupedBackground }}>
        <AuthProvider>
          <ProfileProvider>
            <DateProvider>
              <RootNavigator />
              {/* Glass chrome is translucent, so the status bar follows the
                  appearance rather than being pinned dark. */}
              <StatusBar style={isDark ? 'light' : 'dark'} />
            </DateProvider>
          </ProfileProvider>
        </AuthProvider>
      </View>
    </PaperProvider>
  );
};

export default function App() {
  // Balsamiq Sans is the brand display face; the system face carries the UI.
  const [fontsLoaded] = useFonts({
    BalsamiqSans_400Regular,
    BalsamiqSans_400Regular_Italic,
    BalsamiqSans_700Bold,
    BalsamiqSans_700Bold_Italic,
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1 }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, width: '100%' }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <ThemedApp />
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
