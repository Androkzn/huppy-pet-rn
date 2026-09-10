/**
 * Feedback — empty states and progress.
 *
 * iOS states an empty screen plainly: a large hierarchical symbol, a short
 * title, one explanatory line, and the action that fills it. Progress is a
 * capsule track that animates to its value rather than jumping.
 */

import React, { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useAppTheme } from '@theme/ThemeProvider';
import { motion, radius, spacing } from '@theme/tokens';
import { IOSButton } from './Button';
import { Icon, type SFSymbol } from './Icon';
import { Label } from './Text';

export interface EmptyStateProps {
  symbol: SFSymbol;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  /** Artwork shown instead of the symbol. */
  illustration?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  symbol,
  title,
  message,
  actionLabel,
  onAction,
  illustration,
  style,
}) => {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.empty, style]}>
      {illustration ?? (
        <Icon name={symbol} size={46} color={colors.quaternaryLabel} hierarchical />
      )}
      <View style={styles.emptyText}>
        <Label variant="headline" role="secondary" style={styles.centered}>
          {title}
        </Label>
        {message ? (
          <Label variant="subheadline" role="tertiary" style={styles.centered}>
            {message}
          </Label>
        ) : null}
      </View>
      {actionLabel && onAction ? (
        <IOSButton title={actionLabel} variant="tinted" size="sm" onPress={onAction} />
      ) : null}
    </View>
  );
};

export interface ProgressBarProps {
  /** 0…1; values above 1 are clamped but tint the bar as over-target. */
  value: number;
  color?: string;
  trackColor?: string;
  height?: number;
  /** Colours the bar red once it passes 1. */
  warnOnOverflow?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color,
  trackColor,
  height = 8,
  warnOnOverflow = false,
  style,
}) => {
  const { colors } = useAppTheme();
  const progress = useSharedValue(0);
  const clamped = Math.max(0, Math.min(value, 1));

  useEffect(() => {
    progress.value = withSpring(clamped, motion.smooth);
  }, [clamped, progress]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const fillColor =
    color ?? (warnOnOverflow && value > 1 ? colors.red : colors.tint);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={[
        styles.track,
        { height, borderRadius: radius.capsule, backgroundColor: trackColor ?? colors.tertiaryFill },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          { borderRadius: radius.capsule, backgroundColor: fillColor },
          fillStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    gap: 4,
    alignItems: 'center',
  },
  centered: {
    textAlign: 'center',
  },
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});

export default EmptyState;
