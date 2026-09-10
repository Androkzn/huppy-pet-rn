/**
 * Button — the iOS 26 button styles.
 *
 * `glass` is the Liquid Glass control the system now uses for floating actions;
 * `prominent` is the filled tint that carries a screen's primary action;
 * `tinted` and `plain` step down from there. Capsule is the default shape, as
 * it is across iOS 26.
 *
 * Every press shrinks the control on a spring and fires a haptic — the two
 * cues that make a control feel physical rather than drawn.
 */

import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useAppTheme } from '@theme/ThemeProvider';
import { motion, pressScale, radius as radii, textStyles } from '@theme/tokens';
import { haptics } from '@utils/haptics';
import { Glass } from './Glass';
import { Icon, type SFSymbol } from './Icon';
import { Label } from './Text';

export type ButtonVariant =
  | 'glass'
  | 'glassProminent'
  | 'prominent'
  | 'tinted'
  | 'plain'
  | 'bordered'
  | 'destructive';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface IOSButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  title?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: SFSymbol;
  iconPosition?: 'leading' | 'trailing';
  loading?: boolean;
  fullWidth?: boolean;
  /** Capsule is the iOS 26 default; `rounded` suits controls inside a card. */
  shape?: 'capsule' | 'rounded';
  haptic?: 'light' | 'medium' | 'selection' | 'none';
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const sizing: Record<
  ButtonSize,
  { height: number; paddingHorizontal: number; icon: number; text: 'footnote' | 'subheadline' | 'headline' }
> = {
  sm: { height: 32, paddingHorizontal: 14, icon: 15, text: 'subheadline' },
  md: { height: 44, paddingHorizontal: 20, icon: 17, text: 'headline' },
  lg: { height: 52, paddingHorizontal: 24, icon: 19, text: 'headline' },
};

export const IOSButton: React.FC<IOSButtonProps> = ({
  title,
  variant = 'prominent',
  size = 'md',
  icon,
  iconPosition = 'leading',
  loading = false,
  fullWidth = false,
  shape = 'capsule',
  haptic = 'light',
  disabled,
  onPress,
  style,
  children,
  ...rest
}) => {
  const { colors } = useAppTheme();
  const scale = useSharedValue(1);

  const metrics = sizing[size];
  const cornerRadius =
    shape === 'capsule' ? radii.capsule : size === 'sm' ? radii.sm : radii.md;

  const isGlass = variant === 'glass' || variant === 'glassProminent';

  const contentColor = (() => {
    switch (variant) {
      case 'prominent':
        return colors.onTint;
      case 'glassProminent':
        return colors.onTint;
      case 'destructive':
        return colors.onTint;
      case 'tinted':
      case 'plain':
      case 'bordered':
      case 'glass':
      default:
        return colors.tint;
    }
  })();

  const surface: ViewStyle = (() => {
    switch (variant) {
      case 'prominent':
        return { backgroundColor: colors.tint };
      case 'destructive':
        return { backgroundColor: colors.red };
      case 'tinted':
        return { backgroundColor: colors.tintSoft };
      case 'bordered':
        return {
          backgroundColor: 'transparent',
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.separator,
        };
      case 'plain':
        return { backgroundColor: 'transparent' };
      default:
        return {};
    }
  })();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const body = (
    <View style={styles.content}>
      {icon && iconPosition === 'leading' && !loading ? (
        <Icon name={icon} size={metrics.icon} color={contentColor} weight="semibold" />
      ) : null}

      {loading ? (
        <ActivityIndicator color={contentColor} size="small" />
      ) : title ? (
        <Label
          variant={metrics.text}
          color={contentColor}
          weight="600"
          numberOfLines={1}
          style={styles.label}
        >
          {title}
        </Label>
      ) : (
        children
      )}

      {icon && iconPosition === 'trailing' && !loading ? (
        <Icon name={icon} size={metrics.icon} color={contentColor} weight="semibold" />
      ) : null}
    </View>
  );

  const shell: StyleProp<ViewStyle> = [
    styles.shell,
    {
      height: metrics.height,
      paddingHorizontal: title || children ? metrics.paddingHorizontal : 0,
      minWidth: title || children ? undefined : metrics.height,
      borderRadius: cornerRadius,
    },
    fullWidth && styles.fullWidth,
    surface,
    disabled && styles.disabled,
    style,
  ];

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled, busy: loading }}
      accessibilityLabel={title}
      disabled={disabled || loading}
      onPressIn={() => {
        scale.value = withSpring(pressScale.control, motion.snappy);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, motion.snappy);
      }}
      onPress={(event) => {
        if (haptic !== 'none') haptics[haptic]();
        onPress?.(event);
      }}
      style={[animatedStyle, fullWidth && styles.fullWidth]}
      {...rest}
    >
      {isGlass ? (
        <Glass
          variant="regular"
          radius={cornerRadius}
          interactive
          tintColor={variant === 'glassProminent' ? colors.tint : undefined}
          style={shell}
        >
          {body}
        </Glass>
      ) : (
        <View style={shell}>{body}</View>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  shell: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  label: {
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
    alignSelf: 'stretch',
  },
  disabled: {
    opacity: 0.4,
  },
});

export default IOSButton;
