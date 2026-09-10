/**
 * Theme provider.
 *
 * Resolves the iOS 26 semantic palette against the device color scheme, so a
 * screen asks for `colors.groupedSurface` and gets the right value in either
 * appearance. `useAppTheme` is the single entry point components use; the Paper
 * theme is derived from the same palette so the remaining Paper primitives
 * inherit it.
 */

import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import {
  MD3DarkTheme,
  MD3LightTheme,
  configureFonts,
  type MD3Theme,
} from 'react-native-paper';
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

const buildPaperTheme = (palette: Palette, isDark: boolean): MD3Theme => {
  const base = isDark ? MD3DarkTheme : MD3LightTheme;
  const fontConfig = Object.fromEntries(
    Object.entries(base.fonts).map(([variant, style]) => [
      variant,
      { ...(style as object), fontFamily: fontFamily.system, letterSpacing: 0 },
    ])
  ) as typeof base.fonts;

  return {
    ...base,
    fonts: configureFonts({ config: fontConfig as any }),
    colors: {
      ...base.colors,
      primary: palette.tint,
      onPrimary: palette.onTint,
      primaryContainer: palette.tintSoft,
      onPrimaryContainer: palette.tint,
      secondary: palette.accentSecondary,
      onSecondary: palette.onTint,
      secondaryContainer: palette.secondaryFill,
      onSecondaryContainer: palette.label,
      tertiary: palette.accentSecondary,
      error: palette.red,
      onError: palette.onTint,
      background: palette.groupedBackground,
      onBackground: palette.label,
      surface: palette.groupedSurface,
      onSurface: palette.label,
      surfaceVariant: palette.secondarySystemBackground,
      onSurfaceVariant: palette.secondaryLabel,
      outline: palette.separator,
      outlineVariant: palette.opaqueSeparator,
      shadow: palette.shadow,
      scrim: palette.scrim,
      backdrop: palette.scrim,
      elevation: {
        level0: 'transparent',
        level1: palette.groupedSurface,
        level2: palette.groupedSurfaceElevated,
        level3: palette.secondarySystemBackground,
        level4: palette.secondarySystemBackground,
        level5: palette.tertiarySystemBackground,
      },
    },
  };
};

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

/** Paper theme derived from the same palette. */
export const usePaperTheme = (): MD3Theme => {
  const { colors, isDark } = useAppTheme();
  return useMemo(() => buildPaperTheme(colors, isDark), [colors, isDark]);
};

export { buildPaperTheme };
