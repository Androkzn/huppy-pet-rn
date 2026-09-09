/**
 * Custom Button Component
 */

import React from 'react';
import { Button as PaperButton, useTheme } from 'react-native-paper';
import { StyleSheet, ViewStyle } from 'react-native';

interface ButtonProps {
  mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
  onPress: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  labelStyle?: any;
  uppercase?: boolean;
  compact?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  mode = 'contained',
  onPress,
  children,
  disabled = false,
  loading = false,
  icon,
  style,
  contentStyle,
  labelStyle,
  uppercase = false,
  compact = false,
}) => {
  const theme = useTheme();

  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      disabled={disabled}
      loading={loading}
      icon={icon}
      style={[styles.button, style]}
      contentStyle={[styles.content, contentStyle]}
      labelStyle={[styles.label, labelStyle]}
      uppercase={uppercase}
      compact={compact}
    >
      {children}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
  },
  content: {
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});
