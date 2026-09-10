/**
 * Theme entry point.
 *
 * The app's visual language is the iOS 26 Human Interface Guidelines: semantic
 * colors that resolve per appearance, the system text styles, concentric
 * radii and the platform's spring curves — all defined in `./tokens`.
 *
 * Huppy's palette survives as the tint (orange) and the secondary voice
 * (teal-green), and Balsamiq Sans stays the display face for screen titles.
 */

import * as colors from './colors';
import {
  fontFamily as tokenFontFamily,
  layout as tokenLayout,
  lightPalette,
  radius,
  spacing,
  textStyles,
} from './tokens';
import { buildAppTheme } from './ThemeProvider';

export * from './tokens';
export {
  ThemeProvider,
  useAppTheme,
  useColors,
  buildAppTheme,
} from './ThemeProvider';
export type { AppTheme, ColorSchemeName } from './ThemeProvider';

/**
 * Font families.
 *
 * `regular`/`bold` are the Balsamiq Sans faces the ported screens ask for;
 * `system` is San Francisco, which carries all controls and list rows.
 */
export const fontFamily = {
  regular: 'BalsamiqSans_400Regular',
  bold: 'BalsamiqSans_700Bold',
  italic: 'BalsamiqSans_400Regular_Italic',
  boldItalic: 'BalsamiqSans_700Bold_Italic',
  brand: tokenFontFamily.brand,
  brandRegular: tokenFontFamily.brandRegular,
  system: tokenFontFamily.system,
} as const;

/**
 * Layout metrics. Extends the iOS 26 chrome metrics with the two the ported
 * screens still reference (`sectionHeaderHeight`, `radius`), retuned to the
 * new geometry.
 */
export const layout = {
  ...tokenLayout,
  /** Grouped-section header strip. */
  sectionHeaderHeight: 44,
  /** Default container radius — matches `radius.md`. */
  radius: radius.md,
} as const;

/**
 * Text presets used directly by screens. They mirror the system text styles;
 * `heading`/`cardTitle` keep the brand display face.
 */
export const typography = {
  heading: {
    ...textStyles.footnote,
    fontWeight: '600' as const,
    letterSpacing: 0.4,
    color: lightPalette.secondaryLabel,
  },
  cardTitle: {
    ...textStyles.headline,
    color: lightPalette.label,
  },
  body: {
    ...textStyles.body,
    color: lightPalette.label,
  },
  bodyBold: {
    ...textStyles.headline,
    color: lightPalette.label,
  },
  label: {
    ...textStyles.subheadline,
    color: lightPalette.secondaryLabel,
  },
  tabLabel: textStyles.tabLabel,
} as const;

/** Border radii, kept under the old name for existing imports. */
export const borderRadius = {
  xs: radius.xs,
  sm: radius.sm,
  md: radius.md,
  lg: radius.lg,
  xl: radius.xl,
  full: radius.capsule,
} as const;

export { spacing };

export { colors };
