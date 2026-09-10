/**
 * TextInput — text entry.
 *
 * The iOS field, exposed under the props the earlier code used.
 */

import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { TextField } from '@components/ios/TextField';

interface TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
  /** Accepted for compatibility; iOS fields have one filled presentation. */
  mode?: 'flat' | 'outlined';
  secureTextEntry?: boolean;
  disabled?: boolean;
  error?: boolean;
  errorText?: string;
  multiline?: boolean;
  numberOfLines?: number;
  right?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'decimal-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChangeText,
  label,
  placeholder,
  secureTextEntry = false,
  disabled = false,
  error = false,
  errorText,
  multiline = false,
  numberOfLines,
  right,
  style,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
}) => (
  <TextField
    value={value}
    onChangeText={onChangeText}
    label={label}
    placeholder={placeholder}
    password={secureTextEntry}
    editable={!disabled}
    error={error ? (errorText ?? ' ') : null}
    multiline={multiline}
    numberOfLines={numberOfLines}
    trailing={right}
    containerStyle={style}
    keyboardType={keyboardType}
    autoCapitalize={autoCapitalize}
    autoCorrect={autoCorrect}
  />
);

export default TextInput;
