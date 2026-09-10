/**
 * Theme provider.
 *
 * Resolves the iOS 26 semantic palette against the device color scheme, so a
 * screen asks for `colors.groupedSurface` and gets the right value in either
 * appearance. `useAppTheme` is the single entry point components use.
 */

import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import {
  darkPalette,
  fontFamily,
  lightPalette,
  motion,
  radius,
  shadow,
  spacing,
  textStyles,
  type Palette,
} from './tokens';

export type ColorSchemeName = 'light' | 'dark';

export interface AppTheme {
  scheme: ColorSchemeName;
  isDark: boolean;
  colors: Palette;
  /** Elevation preset bound to the scheme's shadow color. */
  shadow: (level?: 'none' | 'sm' | 'md' | 'lg' | 'floating') => ReturnType<
    typeof shadow
  >;
  spacing: typeof spacing;
  radius: typeof radius;
  motion: typeof motion;
  textStyles: typeof textStyles;
  /** Blur tint to pass to a material when Liquid Glass is unavailable. */
  blurTint: 'systemChromeMaterialLight' | 'systemChromeMaterialDark';
  /** Color scheme to pin a glass surface to. */
  glassScheme: ColorSchemeName;
}

const ThemeContext = createContext<AppTheme | null>(null);

export const buildAppTheme = (scheme: ColorSchemeName): AppTheme => {
  const isDark = scheme === 'dark';
  const colors = isDark ? darkPalette : lightPalette;

  return {
    scheme,
    isDark,
    colors,
    shadow: (level = 'md') => shadow(colors.shadow, level),
    spacing,
    radius,
    motion,
    textStyles,
    blurTint: isDark ? 'systemChromeMaterialDark' : 'systemChromeMaterialLight',
    glassScheme: scheme,
  };
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemScheme = useColorScheme();
  const scheme: ColorSchemeName = systemScheme === 'dark' ? 'dark' : 'light';
  const value = useMemo(() => buildAppTheme(scheme), [scheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

/** The app's design tokens, resolved for the current appearance. */
export const useAppTheme = (): AppTheme => {
  const theme = useContext(ThemeContext);
  // Components are also rendered outside the provider in tests; fall back to
  // the light palette rather than throwing.
  return theme ?? buildAppTheme('light');
};

/** Convenience for the very common `const { colors } = useAppTheme()`. */
export const useColors = (): Palette => useAppTheme().colors;

