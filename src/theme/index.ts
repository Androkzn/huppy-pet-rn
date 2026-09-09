/**
 * Theme Configuration
 *
 * Mirrors the web app's visual identity: the palette from
 * src/components/styles/Colors.js and the 'Balsamiq Sans' body font declared in
 * the web index.css. Material Design roles are mapped onto those colors so the
 * React Native Paper primitives inherit the same look.
 */

import { MD3LightTheme, configureFonts } from 'react-native-paper';
import * as colors from './colors';

/** The web sets `font-family: 'Balsamiq Sans', sans-serif` on <body>. */
export const fontFamily = {
  regular: 'BalsamiqSans_400Regular',
  bold: 'BalsamiqSans_700Bold',
  italic: 'BalsamiqSans_400Regular_Italic',
  boldItalic: 'BalsamiqSans_700Bold_Italic',
} as const;

// Paper's MD3 variants, all re-pointed at Balsamiq Sans.
const baseVariants = MD3LightTheme.fonts;
const fontConfig = Object.fromEntries(
  Object.entries(baseVariants).map(([variant, style]) => [
    variant,
    { ...(style as object), fontFamily: fontFamily.regular, fontWeight: undefined },
  ])
) as typeof baseVariants;

const lightTheme = {
  ...MD3LightTheme,
  fonts: configureFonts({ config: fontConfig as any }),
  colors: {
    ...MD3LightTheme.colors,
    // Orange is the web's accent: selected tabs, pressed buttons, links.
    primary: colors.orange,
    primaryContainer: colors.lightOrange,
    // Green carries headings and icon fills.
    secondary: colors.green,
    secondaryContainer: colors.lightGreen2,
    tertiary: colors.lightGreen,
    tertiaryContainer: colors.oliveLight,
    error: colors.red,
    errorContainer: colors.coffe,
    // Pages sit on white; section bodies use grayBackground, headers use brown.
    background: colors.white,
    surface: colors.white,
    surfaceVariant: colors.grayBackground,
    onPrimary: colors.white,
    onPrimaryContainer: colors.darkOrange,
    onSecondary: colors.white,
    onSecondaryContainer: colors.white,
    onTertiary: colors.white,
    onTertiaryContainer: colors.green,
    onError: colors.white,
    onErrorContainer: colors.darkOrange,
    onBackground: colors.black,
    onSurface: colors.black,
    onSurfaceVariant: colors.gray,
    outline: colors.gray,
    outlineVariant: colors.lightBrown,
    shadow: colors.black,
    scrim: colors.black,
    inverseSurface: colors.green,
    inverseOnSurface: colors.white,
    inversePrimary: colors.lightOrange,
    elevation: {
      level0: 'transparent',
      level1: colors.white,
      level2: colors.lightBrown2,
      level3: colors.grayBackground,
      level4: colors.grayBackground,
      level5: colors.lightBrown,
    },
    surfaceDisabled: 'rgba(0, 0, 0, 0.12)',
    onSurfaceDisabled: 'rgba(0, 0, 0, 0.38)',
    backdrop: 'rgba(0, 0, 0, 0.4)',
  },
};

// The web app has no dark mode — it renders the same light palette everywhere.
export const theme = lightTheme;
export const darkTheme = lightTheme;

/**
 * Typography.
 * The web styles text inline; these are the recurring combinations —
 * section headings (16px bold green), card titles, labels and body copy.
 */
export const typography = {
  /** Section header text, e.g. STATS / DIET BALANCE / ACTIVITIES. */
  heading: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: colors.green,
  },
  cardTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: colors.green,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.black,
  },
  bodyBold: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.black,
  },
  label: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.gray,
  },
  tabLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
  },
} as const;

/** Layout constants taken from the web chrome. */
export const layout = {
  /** AppBar height — NavBar.component.js sets 60px. */
  navBarHeight: 60,
  /** TabBar height — TabBar.component.js sets 65px. */
  tabBarHeight: 65,
  /** Section header strip — Home.css.js headerStyle. */
  sectionHeaderHeight: 40,
  /** Cards and section containers use a 10px radius throughout the web app. */
  radius: 10,
} as const;

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
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
};

export { colors };
