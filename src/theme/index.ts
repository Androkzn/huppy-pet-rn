/**
 * Theme entry point.
 *
 * The visual language is the iOS 26 Human Interface Guidelines: semantic colors
 * that resolve per appearance, the system text styles, concentric radii and the
 * platform's spring curves — all defined in `./tokens`. Huppy's own palette
 * survives as the tint (orange) and the secondary voice (teal-green).
 */

export * from './tokens';
export {
  ThemeProvider,
  useAppTheme,
  useColors,
  buildAppTheme,
} from './ThemeProvider';
export type { AppTheme } from './ThemeProvider';

/** Food category colors — data, not chrome, so they sit outside the palette. */
export * as colors from './colors';
