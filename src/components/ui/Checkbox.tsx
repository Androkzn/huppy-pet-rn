/**
 * Checkbox — a selection mark.
 *
 * iOS states selection with a filled tinted circle carrying a checkmark, and
 * an empty ring when unselected. The mark springs in rather than appearing.
 */

import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useAppTheme } from '@theme/ThemeProvider';
import { motion, radius } from '@theme/tokens';
import { haptics } from '@utils/haptics';
import { Icon } from '@components/ios/Icon';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: number;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 26,
}) => {
  const { colors } = useAppTheme();
  const mark = useSharedValue(checked ? 1 : 0);

  useEffect(() => {
    mark.value = withSpring(checked ? 1 : 0, motion.bouncy);
  }, [checked, mark]);

  const markStyle = useAnimatedStyle(() => ({
    opacity: mark.value,
    transform: [{ scale: 0.6 + mark.value * 0.4 }],
  }));

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      hitSlop={8}
      disabled={disabled}
      onPress={() => {
        haptics.selection();
        onChange(!checked);
      }}
      style={({ pressed }) => [pressed && styles.pressed, disabled && styles.disabled]}
    >
      <View
        style={[
          styles.box,
          {
            width: size,
            height: size,
            borderRadius: radius.capsule,
            borderColor: checked ? 'transparent' : colors.tertiaryLabel,
            backgroundColor: checked ? colors.tint : 'transparent',
          },
        ]}
      >
        <Animated.View style={markStyle}>
          <Icon
            name="checkmark"
            size={size * 0.56}
            weight="bold"
            color={colors.onTint}
            fallbackAsset="checkmark_white.svg"
          />
        </Animated.View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  pressed: {
    opacity: 0.6,
  },
  disabled: {
    opacity: 0.4,
  },
});

export default Checkbox;
