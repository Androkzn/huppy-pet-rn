/**
 * Text — the app's typographic primitives.
 *
 * `Label` (the iOS text component) does the work; this module keeps the
 * Material variant names the earlier code was written against and maps each one
 * onto the equivalent system text style.
 */

import React from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import { Label } from '@components/ios/Text';
import type { TextStyleName } from '@theme/tokens';

type MaterialVariant =
  | 'displayLarge'
  | 'displayMedium'
  | 'displaySmall'
  | 'headlineLarge'
  | 'headlineMedium'
  | 'headlineSmall'
  | 'titleLarge'
  | 'titleMedium'
  | 'titleSmall'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'bodySmall'
  | 'labelLarge'
  | 'labelMedium'
  | 'labelSmall';

/** Material variant → the system text style that plays the same role. */
const VARIANTS: Record<MaterialVariant, TextStyleName> = {
  displayLarge: 'largeTitle',
  displayMedium: 'largeTitle',
  displaySmall: 'title1',
  headlineLarge: 'title1',
  headlineMedium: 'title2',
  headlineSmall: 'title3',
  titleLarge: 'title2',
  titleMedium: 'title3',
  titleSmall: 'headline',
  bodyLarge: 'body',
  bodyMedium: 'body',
  bodySmall: 'callout',
  labelLarge: 'subheadline',
  labelMedium: 'footnote',
  labelSmall: 'caption1',
};

interface TextProps {
  children: React.ReactNode;
  variant?: MaterialVariant | TextStyleName;
  style?: StyleProp<TextStyle>;
  color?: string;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'bodyMedium',
  style,
  color,
  numberOfLines,
  ellipsizeMode,
}) => (
  <Label
    variant={(VARIANTS as Record<string, TextStyleName>)[variant] ?? (variant as TextStyleName)}
    color={color}
    numberOfLines={numberOfLines}
    ellipsizeMode={ellipsizeMode}
    style={style}
  >
    {children}
  </Label>
);

export const Title: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="title2" {...props} />
);

export const Heading: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="title3" {...props} />
);

export const Body: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="body" {...props} />
);

export const Caption: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="footnote" {...props} />
);
