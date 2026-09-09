/**
 * Custom Text Components
 */

import React from 'react';
import { Text as PaperText, useTheme } from 'react-native-paper';
import { TextStyle } from 'react-native';

interface TextProps {
  children: React.ReactNode;
  variant?:
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
  style?: TextStyle | TextStyle[];
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
}) => {
  const theme = useTheme();

  return (
    <PaperText
      variant={variant}
      style={[{ color: color || theme.colors.onSurface }, style]}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
    >
      {children}
    </PaperText>
  );
};

// Convenience components
export const Title: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="titleLarge" {...props} />
);

export const Heading: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="headlineMedium" {...props} />
);

export const Body: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="bodyMedium" {...props} />
);

export const Caption: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="labelSmall" {...props} />
);
