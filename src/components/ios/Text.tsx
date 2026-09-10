/**
 * Label — text in the system text styles.
 *
 * A screen names the role (`headline`, `footnote`, …) rather than a size, so
 * type stays on the iOS scale everywhere, and names a semantic color role
 * (`secondary`, `tint`, …) so it adapts to the appearance on its own.
 */

import React from 'react';
import { Text as RNText, type TextProps, type TextStyle } from 'react-native';
import { useAppTheme } from '@theme/ThemeProvider';
import { fontFamily, textStyles, type TextStyleName } from '@theme/tokens';

export type LabelRole =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'quaternary'
  | 'tint'
  | 'accent'
  | 'onTint'
  | 'destructive'
  | 'positive';

// `role` here names a colour role, which shadows RN's ARIA `role`; use
// `accessibilityRole` for semantics.
export interface LabelProps extends Omit<TextProps, 'role'> {
  variant?: TextStyleName;
  /** Semantic color role; overridden by an explicit `color`. */
  role?: LabelRole;
  color?: string;
  weight?: TextStyle['fontWeight'];
  /** Renders in the rounded system face — reserved for display titles. */
  brand?: boolean;
  /** Section-header treatment: uppercase, tracked out, secondary. */
  sectionHeader?: boolean;
  children?: React.ReactNode;
}

export const Label: React.FC<LabelProps> = ({
  variant = 'body',
  role = 'primary',
  color,
  weight,
  brand = false,
  sectionHeader = false,
  style,
  children,
  ...rest
}) => {
  const { colors } = useAppTheme();

  const roleColor: Record<LabelRole, string> = {
    primary: colors.label,
    secondary: colors.secondaryLabel,
    tertiary: colors.tertiaryLabel,
    quaternary: colors.quaternaryLabel,
    tint: colors.tint,
    accent: colors.accentSecondary,
    onTint: colors.onTint,
    destructive: colors.red,
    positive: colors.green,
  };

  const base = textStyles[variant];

  return (
    <RNText
      style={[
        base,
        { color: color ?? roleColor[role] },
        // The rounded system design carries every weight, so the variant's own
        // weight is kept; only the tracking is relaxed, as rounded faces are
        // drawn wider than the upright one.
        brand ? { fontFamily: fontFamily.brand, letterSpacing: 0 } : null,
        weight ? { fontWeight: weight } : null,
        sectionHeader
          ? {
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              fontWeight: '600',
            }
          : null,
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
};

export default Label;
