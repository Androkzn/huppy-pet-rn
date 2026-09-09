/**
 * Custom Text Input Component
 */

import React from 'react';
import { TextInput as PaperTextInput, useTheme } from 'react-native-paper';
import { StyleSheet, ViewStyle } from 'react-native';

interface TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
  mode?: 'flat' | 'outlined';
  secureTextEntry?: boolean;
  disabled?: boolean;
  error?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  left?: React.ReactNode;
  right?: React.ReactNode;
  style?: ViewStyle;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
}

interface TextInputComponent extends React.FC<TextInputProps> {
  Icon: typeof PaperTextInput.Icon;
  Affix: typeof PaperTextInput.Affix;
}

const TextInputComponent: TextInputComponent = ({
  value,
  onChangeText,
  label,
  placeholder,
  mode = 'outlined',
  secureTextEntry = false,
  disabled = false,
  error = false,
  multiline = false,
  numberOfLines,
  left,
  right,
  style,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
}) => {
  const theme = useTheme();

  return (
    <PaperTextInput
      value={value}
      onChangeText={onChangeText}
      label={label}
      placeholder={placeholder}
      mode={mode}
      secureTextEntry={secureTextEntry}
      disabled={disabled}
      error={error}
      multiline={multiline}
      numberOfLines={numberOfLines}
      left={left}
      right={right}
      style={[styles.input, style]}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      autoCorrect={autoCorrect}
      outlineStyle={styles.outline}
    />
  );
};

// Add Icon and Affix components
TextInputComponent.Icon = PaperTextInput.Icon;
TextInputComponent.Affix = PaperTextInput.Affix;

export const TextInput = TextInputComponent as TextInputComponent;

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'transparent',
  },
  outline: {
    borderRadius: 8,
  },
});
