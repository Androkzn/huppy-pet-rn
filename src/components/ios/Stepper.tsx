/**
 * Stepper — incrementing a number.
 *
 * The iOS stepper shape: one recessed capsule split by a hairline, minus on the
 * left and plus on the right. Here the value sits between them and stays
 * editable, since the forms let you type a portion size directly. Each step
 * fires a selection haptic and the value it produces is clamped.
 */

import React from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useAppTheme } from '@theme/ThemeProvider';
import { layout, radius, textStyles } from '@theme/tokens';
import { haptics } from '@utils/haptics';
import { Icon } from './Icon';

export interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  /** Fires only for the buttons, where the old controls committed instantly. */
  onStep?: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  /** Hides the editable value, leaving just − and +. */
  compact?: boolean;
  editable?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Stepper: React.FC<StepperProps> = ({
  value,
  onChange,
  onStep,
  step = 1,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  compact = false,
  editable = true,
  style,
}) => {
  const { colors } = useAppTheme();

  const clamp = (next: number) => Math.min(Math.max(next, min), max);

  const applyStep = (delta: number) => {
    const next = clamp(value + delta);
    if (next === value) return;
    haptics.selection();
    onChange(next);
    onStep?.(next);
  };

  const canDecrease = value > min;
  const canIncrease = value < max;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.tertiaryFill }, style]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Decrease"
        disabled={!canDecrease}
        onPress={() => applyStep(-step)}
        style={({ pressed }) => [
          styles.button,
          pressed && { backgroundColor: colors.quaternaryFill },
          !canDecrease && styles.disabled,
        ]}
      >
        <Icon name="minus" size={15} weight="semibold" color={colors.label} />
      </Pressable>

      {compact ? null : (
        <>
          <View
            style={[
              styles.divider,
              { backgroundColor: colors.separator, width: layout.hairline },
            ]}
          />
          <TextInput
            value={String(value)}
            editable={editable}
            keyboardType="number-pad"
            selectTextOnFocus
            selectionColor={colors.tint}
            onChangeText={(text) => {
              const parsed = text === '' ? 0 : parseInt(text, 10);
              onChange(clamp(Number.isNaN(parsed) ? 0 : parsed));
            }}
            style={[styles.value, { color: colors.label }]}
          />
          <View
            style={[
              styles.divider,
              { backgroundColor: colors.separator, width: layout.hairline },
            ]}
          />
        </>
      )}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Increase"
        disabled={!canIncrease}
        onPress={() => applyStep(step)}
        style={({ pressed }) => [
          styles.button,
          pressed && { backgroundColor: colors.quaternaryFill },
          !canIncrease && styles.disabled,
        ]}
      >
        <Icon name="plus" size={15} weight="semibold" color={colors.label} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    borderRadius: radius.sm,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  button: {
    width: 44,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: '60%',
  },
  value: {
    minWidth: 54,
    textAlign: 'center',
    paddingHorizontal: 6,
    ...textStyles.subheadline,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.35,
  },
});

export default Stepper;
