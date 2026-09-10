/**
 * HuppyButton — the app's button, in the iOS 26 styles.
 *
 * The screens keep asking for the same variant names they always did; each one
 * now resolves to a platform treatment: prominent tint for primary actions,
 * a soft tinted fill for secondary ones, glass for controls that float over
 * content, and circular tinted buttons for the steppers. Shapes are capsules
 * with continuous corners, presses shrink on a spring, and each one answers
 * with a haptic.
 */

import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useAppTheme } from '@theme/ThemeProvider';
import { motion, pressScale, radius, textStyles } from '@theme/tokens';
import type { Palette } from '@theme/tokens';
import { haptics } from '@utils/haptics';
import { Glass } from '@components/ios/Glass';
import { Label } from '@components/ios/Text';
import { Asset } from './Asset';

export type ButtonVariant =
  | 'addButton'
  | 'deleteButton'
  | 'iconButton'
  | 'circleTextButton'
  | 'circleTextTransparentButton'
  | 'circleTextButtonSmall'
  | 'rectangleTextButton'
  | 'chartTextButton'
  | 'login'
  | 'backButton'
  | 'actionNavigationButton';

type Fill = 'prominent' | 'tinted' | 'destructive' | 'glass' | 'plain' | 'bordered';

interface VariantSpec {
  fill: Fill;
  height: number;
  /** Fixed width, for the circular and pill-shaped variants. */
  width?: number;
  minWidth?: number;
  paddingHorizontal: number;
  text: keyof typeof textStyles;
  /** Capsule unless the variant wants the softer card radius. */
  cornerRadius?: number;
  iconSize: number;
}

const SPECS: Record<ButtonVariant, VariantSpec> = {
  addButton: {
    fill: 'tinted',
    height: 36,
    minWidth: 120,
    paddingHorizontal: 14,
    text: 'subheadline',
    iconSize: 16,
  },
  deleteButton: {
    fill: 'destructive',
    height: 36,
    minWidth: 120,
    paddingHorizontal: 14,
    text: 'subheadline',
    iconSize: 16,
  },
  iconButton: {
    fill: 'plain',
    height: 32,
    paddingHorizontal: 6,
    text: 'subheadline',
    iconSize: 18,
  },
  circleTextButton: {
    fill: 'tinted',
    height: 36,
    width: 36,
    paddingHorizontal: 0,
    text: 'title3',
    iconSize: 18,
  },
  circleTextTransparentButton: {
    fill: 'bordered',
    height: 24,
    width: 24,
    paddingHorizontal: 0,
    text: 'footnote',
    iconSize: 12,
  },
  circleTextButtonSmall: {
    fill: 'tinted',
    height: 28,
    width: 28,
    paddingHorizontal: 0,
    text: 'callout',
    iconSize: 14,
  },
  rectangleTextButton: {
    fill: 'prominent',
    height: 46,
    minWidth: 160,
    paddingHorizontal: 22,
    text: 'headline',
    iconSize: 17,
  },
  chartTextButton: {
    fill: 'tinted',
    height: 28,
    minWidth: 100,
    paddingHorizontal: 14,
    text: 'footnote',
    iconSize: 13,
  },
  login: {
    fill: 'prominent',
    height: 50,
    minWidth: 220,
    paddingHorizontal: 24,
    text: 'headline',
    iconSize: 18,
  },
  backButton: {
    fill: 'glass',
    height: 36,
    paddingHorizontal: 14,
    text: 'subheadline',
    iconSize: 15,
  },
  actionNavigationButton: {
    fill: 'tinted',
    height: 36,
    paddingHorizontal: 14,
    text: 'subheadline',
    iconSize: 15,
  },
};

/** Surface and content colours for a fill, in the current appearance. */
const resolveFill = (
  fill: Fill,
  colors: Palette
): { container: ViewStyle; content: string } => {
  switch (fill) {
    case 'prominent':
      return { container: { backgroundColor: colors.tint }, content: colors.onTint };
    case 'destructive':
      return {
        container: { backgroundColor: colors.red + '1F' },
        content: colors.red,
      };
    case 'tinted':
      return { container: { backgroundColor: colors.tintSoft }, content: colors.tint };
    case 'bordered':
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: colors.tint,
        },
        content: colors.tint,
      };
    case 'plain':
      return { container: { backgroundColor: 'transparent' }, content: colors.tint };
    default:
      return { container: {}, content: colors.tint };
  }
};

/**
 * Legacy style map, kept for callers that inspect a variant's geometry.
 * The rendered look comes from the specs above.
 */
export const buttonVariants: Record<
  ButtonVariant,
  { container: ViewStyle; text: TextStyle }
> = Object.fromEntries(
  (Object.keys(SPECS) as ButtonVariant[]).map((variant) => {
    const spec = SPECS[variant];
    return [
      variant,
      {
        container: {
          height: spec.height,
          width: spec.width,
          minWidth: spec.minWidth,
          paddingHorizontal: spec.paddingHorizontal,
          borderRadius: spec.cornerRadius ?? radius.capsule,
        },
        text: textStyles[spec.text] as TextStyle,
      },
    ];
  })
) as Record<ButtonVariant, { container: ViewStyle; text: TextStyle }>;

interface HuppyButtonProps {
  variant: ButtonVariant;
  children?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  width?: number;
  height?: number;
  background?: string;
  style?: StyleProp<ViewStyle>;
  /** Leading icon, by asset name — resolved to an SF Symbol where there is one. */
  imageName?: string;
  imageSize?: number;
  imageMargin?: number;
  accessibilityLabel?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const HuppyButton: React.FC<HuppyButtonProps> = ({
  variant,
  children,
  onPress,
  disabled,
  width,
  height,
  background,
  style,
  imageName,
  imageSize,
  imageMargin,
  accessibilityLabel,
}) => {
  const { colors } = useAppTheme();
  const spec = SPECS[variant];
  const { container, content } = resolveFill(spec.fill, colors);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const shell: StyleProp<ViewStyle> = [
    styles.shell,
    {
      height: height ?? spec.height,
      width: width ?? spec.width,
      minWidth: spec.minWidth,
      paddingHorizontal: spec.paddingHorizontal,
      borderRadius: spec.cornerRadius ?? radius.capsule,
      gap: imageName ? (imageMargin !== undefined ? imageMargin : 7) : 0,
    },
    container,
    background !== undefined ? { backgroundColor: background } : null,
    disabled ? styles.disabled : null,
    style,
  ];

  const body = (
    <>
      {imageName ? (
        <Asset
          imageName={imageName}
          width={imageSize ?? spec.iconSize}
          height={imageSize ?? spec.iconSize}
          fill={content}
        />
      ) : null}
      {typeof children === 'string' ? (
        <Label variant={spec.text} color={content} weight="600" numberOfLines={1}>
          {children}
        </Label>
      ) : (
        children
      )}
    </>
  );

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={
        accessibilityLabel ?? (typeof children === 'string' ? children : undefined)
      }
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPressIn={() => {
        scale.value = withSpring(pressScale.control, motion.snappy);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, motion.snappy);
      }}
      onPress={() => {
        haptics.light();
        onPress?.();
      }}
      style={animatedStyle}
    >
      {spec.fill === 'glass' ? (
        <Glass
          variant="regular"
          radius={spec.cornerRadius ?? radius.capsule}
          bordered
          interactive
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
  disabled: {
    opacity: 0.4,
  },
});

export default HuppyButton;
