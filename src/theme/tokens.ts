/**
 * iOS 26 design tokens.
 *
 * The vocabulary follows Apple's Human Interface Guidelines for the Liquid
 * Glass design language: semantic colors that resolve per color scheme, the
 * system text styles with their real metrics, concentric corner radii, and the
 * spring curves the system uses for interactive feedback.
 *
 * Brand identity is preserved as the *tint*: Huppy's orange is the accent that
 * paints selection, and the deep teal-green stays the secondary voice. Type is
 * the system face throughout, with the rounded design reserved for display
 * titles, so the app reads as a native iOS app.
 */

import { Platform, TextStyle, ViewStyle } from 'react-native';

/* ------------------------------------------------------------------ *
 * Brand
 * ------------------------------------------------------------------ */

export const brand = {
  orange: '#D3752B',
  orangeLight: '#F0913F',
  orangeSoft: '#F6E2D0',
  green: '#2C5666',
  greenLight: '#7FB4C6',
  teal: '#036564',
  tealLight: '#7DB0AF',
  yellow: '#F3BC48',
  olive: '#939786',
  cream: '#E8D8C9',
  sand: '#DED2B2',
} as const;

/* ------------------------------------------------------------------ *
 * Semantic colors
 * ------------------------------------------------------------------ */

export interface Palette {
  /** Accent that paints selection, links and prominent controls. */
  tint: string;
  /** Accent at low opacity, for tinted button fills and selection pills. */
  tintSoft: string;
  /** Secondary brand voice — headings and supporting glyphs. */
  accentSecondary: string;

  label: string;
  secondaryLabel: string;
  tertiaryLabel: string;
  quaternaryLabel: string;
  /** Label drawn on top of a filled tint surface. */
  onTint: string;

  systemBackground: string;
  secondarySystemBackground: string;
  tertiarySystemBackground: string;
  /** Base of a grouped-list screen. */
  groupedBackground: string;
  /** The rows sitting on that base. */
  groupedSurface: string;
  groupedSurfaceElevated: string;

  fill: string;
  secondaryFill: string;
  tertiaryFill: string;
  quaternaryFill: string;

  separator: string;
  opaqueSeparator: string;

  /** Fallback wash behind a glass surface when the real material is absent. */
  glassFallback: string;
  /** Hairline that gives a glass edge its lens rim. */
  glassBorder: string;
  /** Specular highlight along the top edge of a glass surface. */
  glassHighlight: string;

  red: string;
  green: string;
  blue: string;
  orange: string;
  yellow: string;
  purple: string;

  scrim: string;
  shadow: string;
}

export const lightPalette: Palette = {
  tint: brand.orange,
  tintSoft: 'rgba(211, 117, 43, 0.14)',
  accentSecondary: brand.green,

  label: '#141210',
  secondaryLabel: 'rgba(60, 58, 55, 0.62)',
  tertiaryLabel: 'rgba(60, 58, 55, 0.34)',
  quaternaryLabel: 'rgba(60, 58, 55, 0.20)',
  onTint: '#FFFFFF',

  systemBackground: '#FFFFFF',
  secondarySystemBackground: '#F6F3EE',
  tertiarySystemBackground: '#FFFFFF',
  // A whisper of warmth keeps the pet-app character inside a system-grey base.
  groupedBackground: '#F4F1EB',
  groupedSurface: '#FFFFFF',
  groupedSurfaceElevated: '#FFFFFF',

  fill: 'rgba(124, 118, 110, 0.20)',
  secondaryFill: 'rgba(124, 118, 110, 0.16)',
  tertiaryFill: 'rgba(124, 118, 110, 0.12)',
  quaternaryFill: 'rgba(124, 118, 110, 0.07)',

  separator: 'rgba(70, 66, 60, 0.22)',
  opaqueSeparator: '#DCD6CC',

  glassFallback: 'rgba(255, 255, 255, 0.72)',
  glassBorder: 'rgba(255, 255, 255, 0.55)',
  glassHighlight: 'rgba(255, 255, 255, 0.85)',

  red: '#D6402C',
  green: '#2E8B57',
  blue: '#2F6FB5',
  orange: brand.orange,
  yellow: brand.yellow,
  purple: '#7B5EA7',

  scrim: 'rgba(0, 0, 0, 0.32)',
  shadow: '#2A2018',
};

export const darkPalette: Palette = {
  tint: brand.orangeLight,
  tintSoft: 'rgba(240, 145, 63, 0.20)',
  accentSecondary: brand.greenLight,

  label: '#F7F4F0',
  secondaryLabel: 'rgba(240, 236, 230, 0.60)',
  tertiaryLabel: 'rgba(240, 236, 230, 0.32)',
  quaternaryLabel: 'rgba(240, 236, 230, 0.18)',
  onTint: '#231303',

  systemBackground: '#0D0C0B',
  secondarySystemBackground: '#1A1817',
  tertiarySystemBackground: '#232120',
  groupedBackground: '#0D0C0B',
  groupedSurface: '#1A1817',
  groupedSurfaceElevated: '#232120',

  fill: 'rgba(142, 136, 128, 0.34)',
  secondaryFill: 'rgba(142, 136, 128, 0.28)',
  tertiaryFill: 'rgba(142, 136, 128, 0.20)',
  quaternaryFill: 'rgba(142, 136, 128, 0.13)',

  separator: 'rgba(160, 154, 146, 0.34)',
  opaqueSeparator: '#3A3735',

  glassFallback: 'rgba(28, 26, 24, 0.72)',
  glassBorder: 'rgba(255, 255, 255, 0.16)',
  glassHighlight: 'rgba(255, 255, 255, 0.24)',

  red: '#FF6B58',
  green: '#5FD08A',
  blue: '#6FA8E8',
  orange: brand.orangeLight,
  yellow: '#F7CE6C',
  purple: '#B39BE0',

  scrim: 'rgba(0, 0, 0, 0.52)',
  shadow: '#000000',
};

export const palettes = { light: lightPalette, dark: darkPalette } as const;

/* ------------------------------------------------------------------ *
 * Typography
 * ------------------------------------------------------------------ */

/**
 * Type is the system face throughout.
 *
 * Display titles and large figures use the *rounded* system design — the face
 * Apple itself uses where an app should feel approachable (Fitness, Health,
 * Home). It ships with the OS, so there is no font to download and no loading
 * gate at launch, it carries every weight, and it tracks Dynamic Type. The
 * upright system face carries controls, labels and list rows.
 */
export const fontFamily = {
  brand: Platform.select({ ios: 'SF Pro Rounded', default: undefined }) as
    | string
    | undefined,
  brandRegular: Platform.select({ ios: 'SF Pro Rounded', default: undefined }) as
    | string
    | undefined,
  system: Platform.select({ ios: undefined, default: undefined }) as
    | string
    | undefined,
} as const;

type TextStyleToken = Pick<
  TextStyle,
  'fontSize' | 'lineHeight' | 'fontWeight' | 'letterSpacing'
>;

/** The system text styles, with their HIG point sizes and leading. */
export const textStyles = {
  largeTitle: { fontSize: 34, lineHeight: 41, fontWeight: '700', letterSpacing: 0.37 },
  title1: { fontSize: 28, lineHeight: 34, fontWeight: '700', letterSpacing: 0.36 },
  title2: { fontSize: 22, lineHeight: 28, fontWeight: '700', letterSpacing: 0.35 },
  title3: { fontSize: 20, lineHeight: 25, fontWeight: '600', letterSpacing: 0.38 },
  headline: { fontSize: 17, lineHeight: 22, fontWeight: '600', letterSpacing: -0.41 },
  body: { fontSize: 17, lineHeight: 22, fontWeight: '400', letterSpacing: -0.41 },
  callout: { fontSize: 16, lineHeight: 21, fontWeight: '400', letterSpacing: -0.32 },
  subheadline: { fontSize: 15, lineHeight: 20, fontWeight: '400', letterSpacing: -0.24 },
  footnote: { fontSize: 13, lineHeight: 18, fontWeight: '400', letterSpacing: -0.08 },
  caption1: { fontSize: 12, lineHeight: 16, fontWeight: '400', letterSpacing: 0 },
  caption2: { fontSize: 11, lineHeight: 13, fontWeight: '400', letterSpacing: 0.07 },
  /** Tab bar item label — 10pt, the iOS 26 tab bar metric. */
  tabLabel: { fontSize: 10, lineHeight: 12, fontWeight: '500', letterSpacing: 0.05 },
} satisfies Record<string, TextStyleToken>;

export type TextStyleName = keyof typeof textStyles;

/* ------------------------------------------------------------------ *
 * Metrics
 * ------------------------------------------------------------------ */

/** 4pt rhythm. */
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

/**
 * iOS 26 rounds generously and concentrically: a control inset inside a
 * container takes the container radius minus the inset.
 */
export const radius = {
  xs: 8,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  xxl: 28,
  sheet: 38,
  capsule: 999,
} as const;

/** Apple draws squircles; RN exposes them through `borderCurve`. */
export const continuous = { borderCurve: 'continuous' } as const satisfies ViewStyle;

export const layout = {
  /** Compact navigation bar content height, above the status bar. */
  navBarHeight: 52,
  /** Large-title row height added below the compact bar. */
  largeTitleHeight: 52,
  /** Floating tab bar capsule height. */
  tabBarHeight: 60,
  /** Gap between the tab bar capsule and the bottom safe area. */
  tabBarInset: 12,
  /** Side margin of an inset grouped list. */
  screenPadding: 16,
  /** Minimum comfortable hit target. */
  hitSlop: 44,
  hairline: Platform.select({ ios: 0.33, default: 0.5 }) as number,
} as const;

/* ------------------------------------------------------------------ *
 * Elevation
 * ------------------------------------------------------------------ */

export const shadow = (
  color: string,
  level: 'none' | 'sm' | 'md' | 'lg' | 'floating' = 'md'
): ViewStyle => {
  switch (level) {
    case 'none':
      return {};
    case 'sm':
      return {
        shadowColor: color,
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      };
    case 'lg':
      return {
        shadowColor: color,
        shadowOpacity: 0.14,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 12 },
        elevation: 12,
      };
    case 'floating':
      return {
        shadowColor: color,
        shadowOpacity: 0.18,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 8 },
        elevation: 16,
      };
    default:
      return {
        shadowColor: color,
        shadowOpacity: 0.09,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
      };
  }
};

/* ------------------------------------------------------------------ *
 * Motion
 * ------------------------------------------------------------------ */

/** Reanimated spring configs mirroring the system's interactive curves. */
export const motion = {
  /** Control press / release — settles fast, no overshoot. */
  snappy: { damping: 26, stiffness: 420, mass: 0.85 },
  /** Layout and selection changes. */
  smooth: { damping: 30, stiffness: 240, mass: 1 },
  /** Playful emphasis, e.g. a tab icon accepting a tap. */
  bouncy: { damping: 14, stiffness: 260, mass: 0.9 },
  /** Sheets and large surfaces. */
  sheet: { damping: 34, stiffness: 300, mass: 1.1 },
  duration: { fast: 150, base: 250, slow: 380 },
} as const;

/** How far a control shrinks while held. */
export const pressScale = {
  control: 0.96,
  card: 0.985,
  icon: 0.9,
} as const;
