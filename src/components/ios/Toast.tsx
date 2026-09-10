/**
 * Toast — a transient status banner.
 *
 * Modelled on the notification capsules iOS 26 drops from the top edge: a glass
 * pill carrying a status symbol and one line of text, arriving on a spring and
 * leaving on its own. It never blocks the page, and it can be swiped away.
 */

import React, { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@theme/ThemeProvider';
import { layout, motion, radius } from '@theme/tokens';
import { Glass } from './Glass';
import { Icon, type SFSymbol } from './Icon';
import { Label } from './Text';

export type ToastKind = 'success' | 'error' | 'info';

export interface ToastProps {
  message: string;
  kind?: ToastKind;
  visible: boolean;
  onHide: () => void;
  /** Milliseconds on screen before it retreats. */
  duration?: number;
}

const symbols: Record<ToastKind, SFSymbol> = {
  success: 'checkmark.circle.fill',
  error: 'exclamationmark.circle.fill',
  info: 'info.circle.fill',
};

export const Toast: React.FC<ToastProps> = ({
  message,
  kind = 'info',
  visible,
  onHide,
  duration = 3000,
}) => {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const offset = useSharedValue(-160);
  const opacity = useSharedValue(0);

  // Held in a ref so a parent re-render cannot restart the dismissal timer.
  // The ref is updated in an effect rather than during render: writing to a ref
  // while rendering is not safe under concurrent rendering, where a render can
  // be thrown away.
  const hide = useRef(onHide);
  useEffect(() => {
    hide.current = onHide;
  }, [onHide]);

  useEffect(() => {
    if (visible) {
      offset.value = withSpring(0, motion.smooth);
      opacity.value = withTiming(1, { duration: motion.duration.fast });
      const timer = setTimeout(() => hide.current(), duration);
      return () => clearTimeout(timer);
    }
    offset.value = withTiming(-160, { duration: motion.duration.base });
    opacity.value = withTiming(0, { duration: motion.duration.base });
    return undefined;
  }, [visible, duration, offset, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
    opacity: opacity.value,
  }));

  const accent =
    kind === 'success' ? colors.green : kind === 'error' ? colors.red : colors.tint;

  return (
    <Animated.View
      pointerEvents={visible ? 'box-none' : 'none'}
      style={[styles.host, { top: insets.top + 6 }, animatedStyle]}
    >
      <Pressable accessibilityRole="alert" accessibilityLabel={message} onPress={onHide}>
        <Glass variant="regular" radius={radius.capsule} bordered style={styles.pill}>
          <View style={styles.row}>
            <Icon name={symbols[kind]} size={20} color={accent} />
            <Label variant="subheadline" numberOfLines={2} style={styles.message}>
              {message}
            </Label>
          </View>
        </Glass>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: layout.screenPadding,
    right: layout.screenPadding,
    alignItems: 'center',
    zIndex: 1000,
  },
  pill: {
    maxWidth: 460,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  message: {
    flexShrink: 1,
  },
});

export default Toast;
