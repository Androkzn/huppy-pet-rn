/**
 * App entry point.
 *
 * Type is the system face — including the rounded design used for display
 * titles — so there is no webfont to load and the first frame is the real UI
 * rather than a blank gate.
 */

import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useAppTheme } from './src/theme/ThemeProvider';
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
 * Everything below the theme provider, so the background and status bar follow
 * the appearance it resolved.
 */
const ThemedApp = () => {
  const { colors, isDark } = useAppTheme();

  return (
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
  );
};

export default function App() {
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
