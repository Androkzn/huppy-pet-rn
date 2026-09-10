/**
 * TextField — the iOS text entry control.
 *
 * A filled, continuous-corner field that tints its border while focused, offers
 * the clear button once there is something to clear, and reveals a password
 * behind the standard eye control. Errors are stated under the field in red,
 * never by turning the field itself into an alarm.
 */

import React, { forwardRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { useAppTheme } from '@theme/ThemeProvider';
import { radius, textStyles } from '@theme/tokens';
import { Icon, type SFSymbol } from './Icon';
import { Label } from './Text';

export interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  /** Message shown under the field; also tints the border. */
  error?: string | null;
  /** Quiet helper text under the field. */
  hint?: string;
  symbol?: SFSymbol;
  /** Adds the reveal control and starts obscured. */
  password?: boolean;
  /** Search presentation: capsule, magnifier, always-on clear button. */
  search?: boolean;
  clearable?: boolean;
  trailing?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}

export const TextField = forwardRef<TextInput, TextFieldProps>(
  (
    {
      label,
      error,
      hint,
      symbol,
      password = false,
      search = false,
      clearable = true,
      trailing,
      containerStyle,
      style,
      value,
      onChangeText,
      onFocus,
      onBlur,
      ...rest
    },
    ref
  ) => {
    const { colors } = useAppTheme();
    const [focused, setFocused] = useState(false);
    const [revealed, setRevealed] = useState(false);

    const hasValue = (value ?? '').length > 0;
    const leadingSymbol: SFSymbol | undefined = search ? 'magnifyingglass' : symbol;
    const borderColor = error
      ? colors.red
      : focused
        ? colors.tint
        : 'transparent';

    return (
      <View style={[styles.container, containerStyle]}>
        {label ? (
          <Label variant="footnote" role="secondary" style={styles.label}>
            {label}
          </Label>
        ) : null}

        <View
          style={[
            styles.field,
            {
              backgroundColor: search ? colors.tertiaryFill : colors.groupedSurface,
              borderColor,
              borderRadius: search ? radius.sm : radius.md,
            },
            style,
          ]}
        >
          {leadingSymbol ? (
            <Icon
              name={leadingSymbol}
              size={17}
              color={focused || hasValue ? colors.secondaryLabel : colors.tertiaryLabel}
            />
          ) : null}

          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            placeholderTextColor={colors.tertiaryLabel}
            selectionColor={colors.tint}
            secureTextEntry={password && !revealed}
            onFocus={(event) => {
              setFocused(true);
              onFocus?.(event);
            }}
            onBlur={(event) => {
              setFocused(false);
              onBlur?.(event);
            }}
            style={[styles.input, { color: colors.label }]}
            {...rest}
          />

          {/* A password field carries the reveal control instead, as iOS does. */}
          {clearable && hasValue && !password ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear text"
              hitSlop={8}
              onPress={() => onChangeText?.('')}
            >
              <Icon name="xmark.circle.fill" size={17} color={colors.tertiaryLabel} />
            </Pressable>
          ) : null}

          {/* The reveal control is offered from the start, as Safari does, so a
              password can be checked before there is anything to hide. */}
          {password ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={revealed ? 'Hide password' : 'Show password'}
              hitSlop={8}
              onPress={() => setRevealed((current) => !current)}
            >
              <Icon
                name={revealed ? 'eye.slash' : 'eye'}
                size={17}
                color={colors.secondaryLabel}
                fallbackAsset={
                  revealed ? 'hide_password.svg' : 'show_password.svg'
                }
              />
            </Pressable>
          ) : null}

          {trailing}
        </View>

        {error ? (
          <Label variant="footnote" role="destructive" style={styles.helper}>
            {error}
          </Label>
        ) : hint ? (
          <Label variant="footnote" role="secondary" style={styles.helper}>
            {hint}
          </Label>
        ) : null}
      </View>
    );
  }
);

TextField.displayName = 'TextField';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 5,
  },
  label: {
    paddingHorizontal: 4,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 46,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderCurve: 'continuous',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    ...textStyles.body,
  },
  helper: {
    paddingHorizontal: 4,
  },
});

export default TextField;
