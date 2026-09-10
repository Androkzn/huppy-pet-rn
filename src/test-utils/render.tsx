/**
 * Test render helper.
 *
 * Wraps a component in the providers the app supplies at runtime — theme,
 * query client, safe-area and gesture handling — so a test renders the real
 * component rather than a stubbed one.
 */

import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@theme/ThemeProvider';

/** Metrics a device would report, so safe-area insets resolve in a test. */
const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 393, height: 852 },
  insets: { top: 59, left: 0, right: 0, bottom: 34 },
};

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, cacheTime: 0, staleTime: Infinity },
      mutations: { retry: false },
    },
  });

interface Options extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
}

/** Testing Library renders asynchronously, so callers await this. */
export const renderWithProviders = async (
  ui: React.ReactElement,
  { queryClient = createTestQueryClient(), ...options }: Options = {}
) => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <SafeAreaProvider initialMetrics={safeAreaMetrics}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>{children}</ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );

  const result = await render(ui, { wrapper: Wrapper, ...options });
  return { queryClient, ...result };
};

export * from '@testing-library/react-native';
