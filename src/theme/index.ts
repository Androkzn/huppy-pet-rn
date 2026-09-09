/**
 * Theme Configuration
 * Material Design 3 theme using React Native Paper
 */

import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#FF6B35',
    primaryContainer: '#FFE5DC',
    secondary: '#6C63FF',
    secondaryContainer: '#E8E6FF',
    tertiary: '#00B4D8',
    tertiaryContainer: '#D9F3FA',
    error: '#BA1A1A',
    errorContainer: '#FFDAD6',
    background: '#E9E4D7',
    surface: '#E9E4D7',
    surfaceVariant: '#F5F5F5',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#3E0400',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#1A0066',
    onTertiary: '#FFFFFF',
    onTertiaryContainer: '#001F24',
    onError: '#FFFFFF',
    onErrorContainer: '#410002',
    onBackground: '#201A19',
    onSurface: '#201A19',
    onSurfaceVariant: '#53433F',
    outline: '#857370',
    outlineVariant: '#D8C2BE',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#362F2E',
    inverseOnSurface: '#FBEEEC',
    inversePrimary: '#FFB59B',
    elevation: {
      level0: 'transparent',
      level1: '#F9F9F9',
      level2: '#F5F5F5',
      level3: '#F0F0F0',
      level4: '#EEEEEE',
      level5: '#EBEBEB',
    },
    surfaceDisabled: 'rgba(32, 26, 25, 0.12)',
    onSurfaceDisabled: 'rgba(32, 26, 25, 0.38)',
    backdrop: 'rgba(51, 30, 26, 0.4)',
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#FFB59B',
    primaryContainer: '#8C2800',
    secondary: '#B9B0FF',
    secondaryContainer: '#3E2F8A',
    tertiary: '#56D6F5',
    tertiaryContainer: '#004F58',
    error: '#FFB4AB',
    errorContainer: '#93000A',
    background: '#201A19',
    surface: '#201A19',
    surfaceVariant: '#53433F',
    onPrimary: '#561F00',
    onPrimaryContainer: '#FFE5DC',
    onSecondary: '#250066',
    onSecondaryContainer: '#E8E6FF',
    onTertiary: '#00363D',
    onTertiaryContainer: '#D9F3FA',
    onError: '#690005',
    onErrorContainer: '#FFDAD6',
    onBackground: '#ECE0DD',
    onSurface: '#ECE0DD',
    onSurfaceVariant: '#D8C2BE',
    outline: '#A08C89',
    outlineVariant: '#53433F',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#ECE0DD',
    inverseOnSurface: '#362F2E',
    inversePrimary: '#B33800',
    elevation: {
      level0: 'transparent',
      level1: '#2B2321',
      level2: '#322725',
      level3: '#382B29',
      level4: '#3A2C2A',
      level5: '#3F2F2D',
    },
    surfaceDisabled: 'rgba(236, 224, 221, 0.12)',
    onSurfaceDisabled: 'rgba(236, 224, 221, 0.38)',
    backdrop: 'rgba(49, 36, 33, 0.4)',
  },
};

// Export default light theme
export const theme = lightTheme;
export { darkTheme };

// Typography
export const typography = {
  displayLarge: {
    fontSize: 57,
    fontWeight: '400' as const,
    lineHeight: 64,
  },
  displayMedium: {
    fontSize: 45,
    fontWeight: '400' as const,
    lineHeight: 52,
  },
  displaySmall: {
    fontSize: 36,
    fontWeight: '400' as const,
    lineHeight: 44,
  },
  headlineLarge: {
    fontSize: 32,
    fontWeight: '400' as const,
    lineHeight: 40,
  },
  headlineMedium: {
    fontSize: 28,
    fontWeight: '400' as const,
    lineHeight: 36,
  },
  headlineSmall: {
    fontSize: 24,
    fontWeight: '400' as const,
    lineHeight: 32,
  },
  titleLarge: {
    fontSize: 22,
    fontWeight: '400' as const,
    lineHeight: 28,
  },
  titleMedium: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
  },
  titleSmall: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  labelLarge: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  labelMedium: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
  },
  labelSmall: {
    fontSize: 11,
    fontWeight: '500' as const,
    lineHeight: 16,
  },
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border Radius
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};
