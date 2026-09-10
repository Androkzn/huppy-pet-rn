/**
 * LoginTextInput — the field used across the auth screens.
 *
 * The iOS field, sized to the auth forms' full-width column, with the standard
 * reveal control on password entries.
 */

import React from 'react';
import { StyleSheet, type TextInputProps } from 'react-native';
import { TextField } from '@components/ios/TextField';

interface LoginTextInputProps extends Omit<TextInputProps, 'style'> {
  isPassword?: boolean;
  /** Legacy error affordance: a coloured outline. */
  borderColor?: string;
  label?: string;
  error?: string | null;
}

export const LoginTextInput: React.FC<LoginTextInputProps> = ({
  isPassword = false,
  borderColor,
  label,
  error,
  ...rest
}) => (
  <TextField
    label={label}
    password={isPassword}
    error={error ?? (borderColor ? ' ' : null)}
    containerStyle={styles.container}
    {...rest}
  />
);

const styles = StyleSheet.create({
  container: {
    maxWidth: 420,
    alignSelf: 'center',
  },
});

export default LoginTextInput;
