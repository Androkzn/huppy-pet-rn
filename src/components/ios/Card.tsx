/**
 * Card — a rounded surface for grouped content.
 *
 * Cards on iOS 26 are quiet: a continuous-corner surface, a whisper of shadow,
 * no borders. A tappable card shrinks slightly under the finger instead of
 * flashing, which is what makes it feel like a physical tile.
 */

import React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useAppTheme } from '@theme/ThemeProvider';
import { layout, motion, pressScale, radius as radii } from '@theme/tokens';
import { Glass } from './Glass';
import { Label } from './Text';

export interface CardProps {
  variant?: 'surface' | 'elevated' | 'glass' | 'tinted';
  /** Section title rendered inside the card, above the content. */
  title?: string;
  padding?: number;
  radius?: number;
  /** Card spans the screen width instead of the inset list width. */
  edgeToEdge?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Card: React.FC<CardProps> = ({
  variant = 'surface',
  title,
  padding = 14,
  radius = radii.lg,
  edgeToEdge = false,
  onPress,
  style,
  contentStyle,
  children,
}) => {
  const theme = useAppTheme();
  const { colors } = theme;
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const surface: ViewStyle = (() => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.groupedSurfaceElevated,
          ...theme.shadow('md'),
        };
      case 'tinted':
        return { backgroundColor: colors.tintSoft };
      case 'glass':
        return {};
      default:
        return { backgroundColor: colors.groupedSurface };
    }
  })();

  const shell: StyleProp<ViewStyle> = [
    styles.card,
    { borderRadius: radius },
    !edgeToEdge && { marginHorizontal: layout.screenPadding },
    surface,
    style,
  ];

  const body = (
    <View style={[{ padding }, contentStyle]}>
      {title ? (
        <Label variant="headline" style={styles.title}>
          {title}
        </Label>
      ) : null}
      {children}
    </View>
  );

  const inner =
    variant === 'glass' ? (
      <Glass variant="regular" radius={radius} bordered style={shell}>
        {body}
      </Glass>
    ) : (
      <View style={shell}>{body}</View>
    );

  if (!onPress) return inner;

  return (
    <AnimatedPressable
      accessibilityRole="button"
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(pressScale.card, motion.snappy);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, motion.snappy);
      }}
      style={animatedStyle}
    >
      {inner}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  title: {
    marginBottom: 8,
  },
});

export default Card;
