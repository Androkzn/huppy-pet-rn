/**
 * Button — the general-purpose button.
 *
 * Maps the Material `mode` the earlier code used onto the iOS 26 button styles.
 */

import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { IOSButton, type ButtonVariant } from '@components/ios/Button';

interface ButtonProps {
  mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
  onPress: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: unknown;
  contentStyle?: unknown;
  uppercase?: boolean;
  compact?: boolean;
  fullWidth?: boolean;
}

const MODES: Record<NonNullable<ButtonProps['mode']>, ButtonVariant> = {
  contained: 'prominent',
  elevated: 'glass',
  'contained-tonal': 'tinted',
  outlined: 'bordered',
  text: 'plain',
};

export const Button: React.FC<ButtonProps> = ({
  mode = 'contained',
  onPress,
  children,
  disabled = false,
  loading = false,
  style,
  compact = false,
  fullWidth = false,
}) => (
  <IOSButton
    variant={MODES[mode]}
    size={compact ? 'sm' : 'md'}
    title={typeof children === 'string' ? children : undefined}
    onPress={onPress}
    disabled={disabled}
    loading={loading}
    fullWidth={fullWidth}
    style={style}
  >
    {typeof children === 'string' ? undefined : children}
  </IOSButton>
);
