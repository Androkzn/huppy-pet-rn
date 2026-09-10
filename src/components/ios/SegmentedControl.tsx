/**
 * SegmentedControl — the iOS picker for a small set of mutually exclusive
 * options. A recessed track with a raised thumb that springs to the chosen
 * segment, and a selection haptic on every change.
 */

import React, { useState } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated';
import { useAppTheme } from '@theme/ThemeProvider';
import { motion, radius } from '@theme/tokens';
import { haptics } from '@utils/haptics';
import { Label } from './Text';

export interface Segment<T extends string> {
  label: string;
  value: T;
}

export interface SegmentedControlProps<T extends string> {
  segments: Segment<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
}

export function SegmentedControl<T extends string>({
  segments,
  value,
  onChange,
  size = 'md',
  style,
}: SegmentedControlProps<T>) {
  const theme = useAppTheme();
  const { colors } = theme;
  const [width, setWidth] = useState(0);

  const height = size === 'sm' ? 30 : 34;
  const padding = 2;
  const index = Math.max(0, segments.findIndex((segment) => segment.value === value));
  const segmentWidth = width > 0 ? (width - padding * 2) / segments.length : 0;

  const position = useDerivedValue(() => withSpring(index, motion.smooth), [index]);

  const thumbStyle = useAnimatedStyle(() => ({
    width: segmentWidth,
    transform: [{ translateX: padding + position.value * segmentWidth }],
    opacity: segmentWidth > 0 ? 1 : 0,
  }));

  return (
    <View
      accessibilityRole="tablist"
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      style={[
        styles.track,
        { height, borderRadius: radius.capsule, backgroundColor: colors.tertiaryFill },
        style,
      ]}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.thumb,
          {
            top: padding,
            bottom: padding,
            borderRadius: radius.capsule,
            backgroundColor: colors.groupedSurface,
            ...theme.shadow('sm'),
          },
          thumbStyle,
        ]}
      />

      {segments.map((segment) => {
        const selected = segment.value === value;
        return (
          <Pressable
            key={segment.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={segment.label}
            style={styles.segment}
            onPress={() => {
              if (selected) return;
              haptics.selection();
              onChange(segment.value);
            }}
          >
            <Label
              variant={size === 'sm' ? 'footnote' : 'subheadline'}
              weight={selected ? '600' : '400'}
              role={selected ? 'primary' : 'secondary'}
              numberOfLines={1}
            >
              {segment.label}
            </Label>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    alignItems: 'stretch',
    padding: 2,
    borderCurve: 'continuous',
  },
  thumb: {
    position: 'absolute',
    left: 0,
    borderCurve: 'continuous',
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SegmentedControl;
